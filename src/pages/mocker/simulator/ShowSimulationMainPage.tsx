import React from "react";
import { ENV as env } from "../../../util/env";
import { Box, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { Http_methodEnum } from "../../../api/generated/mocker-config/MockResource";
import Title from "../../../components/pages/Title";
import { ButtonNaked } from "@pagopa/mui-italia";
import { ArrowBack, Send } from "@mui/icons-material";
import axios from "axios";
import { getFormattedBody } from "../../../util/utilities";


interface IProps {
  match: {
    params: Record<string, unknown>;
  };
  history: {
    push(url: string): void;
    goBack(): void;
  };
  location: any;
}
  
interface IState {
  isLoading: boolean;
  simulation: {
    httpMethod: string,
    root: string,
    url: string,
    headers?: string,
    body?: string
  },
  response: IResponse
}

interface IResponse {
  body: string,
  status: number,
  headers: any,
  time: number
}

export default class ShowSimulationMainPage extends React.Component<IProps, IState> {

  httpMethodRegEx = new RegExp(/-X (.*) \\/gm);
  locationRegEx = new RegExp(/--location '(.*)'/gm);
  headerRegEx = new RegExp(/--header '(.*)'/gm);
  bodyRegEx = new RegExp(/--data '([\s\S\n\t]*)'/gm);

  constructor(props: IProps) {
    super(props);
    this.state = {
      isLoading: false,
      simulation: {
        httpMethod: "GET",
        root: env.MOCKER.HOST + env.MOCKER.BASEPATH,
        url: "",
      },
      response: {
        body: "",
        status: 0,
        headers: [],
        time: 0
      }
    }
  }



  sendRequestToMocker() {
    let headers = {
      "X-Source-Client": "pagopa-shared-toolbox"
    };

    const headerList = this.state.simulation.headers?.split(",");
    headerList?.forEach((header) => {
      const headerContent = header.trim().split(":");
      (headers as any)[headerContent[0]] = headerContent[1];
    })

    axios.request({
      baseURL: this.state.simulation.root,
      url: this.state.simulation.url,
      method: this.state.simulation.httpMethod,
      data: this.state.simulation.body,
      headers: headers
    })
    .then((res) => {
      let response = {
        body: res.data,
        status: res.status,
        headers: res.headers,
        time: 0
      }
      this.setState({response});
      console.log(this.state.response);
    })
    .catch((res) => {
      let response = {
        body: res.response.data,
        status: res.response.status,
        headers: res.response.headers,
        time: 0
      }
      this.setState({response});
      console.log(this.state.response);
    });
  }



  isStringInvalid = (value: string | undefined) => !value || value === "";

  initFromCURL(cURL: string) {
    let simulation = this.state.simulation;
    // set URL
    let decodedCURL = atob(cURL);
    var match;
    while (match = this.locationRegEx.exec(decodedCURL)) {
      simulation.url = match[1];
    }
    simulation.url = simulation.url.replace(env.MOCKER.HOST, "");
    simulation.url = simulation.url.replace(env.MOCKER.BASEPATH, "");
    // set HTTP method
    while (match = this.httpMethodRegEx.exec(decodedCURL)) {
      simulation.httpMethod = match[1];
    }
    // set headers
    let headers = [];
    while (match = this.headerRegEx.exec(decodedCURL)) {
      headers.push(match[1]);
    }
    simulation.headers = headers.join(", ");
    // set body
    while (match = this.bodyRegEx.exec(decodedCURL)) {
      simulation.body = match[1];
      simulation.body = atob(simulation.body);
    }

    this.setState({ simulation });
  }

  setField(name: string, value?: unknown) {
    let simulation = this.state.simulation;
    (simulation as any)[name] = value;
    this.setState({ simulation });
  }



  getFormattedResponse = (response: IResponse) => {
    let headers: any = [];
    Object.keys(response.headers).forEach((headerName: string) => {
      if (!headerName.startsWith("access-control-")) {
        headers.push(
          <Typography variant="body2" sx={{ fontSize: '14px'}}>
            <b>{headerName}: </b><Typography variant="caption" sx={{ fontSize: '14px'}}>{response.headers[headerName]}</Typography>
          </Typography>
        )
      }
    });
    return (
      <Box>
          <Typography variant="body2" sx={{ fontSize: '14px'}}>
            <b>Status:</b> <Typography variant="caption" sx={{ fontSize: '14px'}}>{response.status}</Typography>
          </Typography>
          <Divider/>
          {headers}
      </Box>
    );
  }



  redirectToPreviousPage() {
    this.props.history.goBack();
  }



  componentDidMount(): void {
    const query = new URLSearchParams(location.href.split('?')[1]);
    const cURL = query.get('curl');
    if (cURL !== null) {
      this.initFromCURL(cURL);
    }
  }



  render(): React.ReactNode {
      return (
        <Grid container mb={12}>
          <Grid item xs={12}>
            <Stack direction="row">
              <ButtonNaked size="small" component="button" onClick={() => this.redirectToPreviousPage()} startIcon={<ArrowBack/>} sx={{color: 'primary.main', mr: '20px'}} weight="default">
                Back
              </ButtonNaked>
            </Stack>
            <Grid container mt={3}>
              <Grid item xs={11} mb={2}>
                <Title title="Simulate mocking process" mbTitle={1} variantTitle="h4"/>
              </Grid>            
            </Grid>

            <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
              <Grid container alignItems={'center'} spacing={0} mb={2}>
                <Grid item xs={11}>
                  <Typography variant="h5">Request</Typography>
                </Grid>
                <Grid item xs={1}>
                  <ButtonNaked size="small" component="button" onClick={() => this.sendRequestToMocker()} startIcon={<Send/>} sx={{color: 'green', mr: '20px'}} weight="default">Send</ButtonNaked>
                </Grid>
              </Grid>
              <Divider style={{marginBottom: 20}}/>
              <Grid container alignItems={"center"} spacing={1} mb={2}>
                <Grid item xs={3}>
                <TextField id="mocker_url" label="Mocker URL" disabled={true} value={this.state.simulation.root} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={7}>
                  <TextField id="subsystem" label="URL" placeholder="/resource/path" required={true} value={this.state.simulation.url} onChange={(event) => this.setField("url", event.target.value)} error={this.isStringInvalid(this.state.simulation.url)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth key={`http_method`}>
                    <InputLabel>HTTP Method</InputLabel>
                    <Select id="http_method" required={true} value={this.state.simulation.httpMethod} onChange={(event) => this.setField("httpMethod", event.target.value)}>
                      {Object.keys(Http_methodEnum).map((method) => (
                        <MenuItem key={method} value={method}>
                          {method}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container alignItems={"center"} spacing={1} mb={2}>
                <Grid item xs={12}>
                  <TextField id="headers" label="Headers (split by comma)" placeholder="header1:value, header2:value, ..." value={this.state.simulation.headers} onChange={(event) => this.setField("headers", event.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: "100%" }}/>
                </Grid>
              </Grid>
              <Grid container alignItems={"center"} spacing={1} mb={2}>
                <Grid item xs={12}>
                  <TextField id="body" multiline label="Request (in string, XML or JSON)" rows={15} value={this.state.simulation.body} onChange={(event) => this.setField("body", event.target.value)} InputProps={{ sx: {fontSize: '8px', typography: 'caption'} }} InputLabelProps={{ shrink: true }} sx={{ width: '100%', fontSize: '8px', typography: 'caption' }} />
                </Grid>
              </Grid>
            </Paper>
            
            <Paper elevation={8} sx={{ marginBottom: 2, borderRadius: 4, p: 4 }}>
              <Grid container alignItems={'center'} spacing={0} mb={2}>
                <Grid item xs={12}>
                  <Typography variant="h5">Response</Typography>
                </Grid>
              </Grid>
              <Divider style={{marginBottom: 20}}/>
              {
                this.state.response.status > 0 &&
                <Grid container alignItems={'center'} spacing={0} mb={2}>
                  <Grid item sx={{ width: '100%' }}>
                    <Box sx={{ width: '100%', marginBottom: 2, borderRadius: 4, p: 1, backgroundColor: '#f6f6f6', typography: 'caption' }}>
                      {this.getFormattedResponse(this.state.response)}
                      <Box sx={{ marginBottom: 1, marginTop: 1, borderRadius: 4, p: 1, backgroundColor: 'white', fontSize: '8px', typography: 'caption', whiteSpace: 'pre-wrap' }}>
                        {getFormattedBody(this.state.response.body, false)}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              }
            </Paper>
          </Grid>
        </Grid>
      );
    }
}

