import React from "react";
import axios from "axios";
import {  Tooltip } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { FaEdit, FaEye, FaThumbsDown, FaThumbsUp, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import ConfirmationModal from "../ConfirmationModal";

interface IProps {
  item: {
    id: string,
    name: string;
    subsystem: string;
    resource_url: string;
    soap_action: string;
    http_method: string;
    tags: string;
    is_active: boolean;
  };
  history: {
      push(url: string): void;
  };
}

interface IState {
  showDeleteModal: boolean;
  mockResourceTarget: string
}

export default class MockResourceListItem extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      showDeleteModal: false,
      mockResourceTarget: ""
    }
  }

  redirectToShowMockResourceDetail(code: string) {
    this.props.history.push("/configuration/mock-resources/" + code);
  }

  redirectToEditMockResourceDetail(code: string) {
    this.props.history.push("/configuration/mock-resources/" + code + "?edit");
  }

  toastError(message: string) {
    toast.error(() => <div className={"toast-width"}>{message}</div>, {
      theme: "colored",
    });
  }

  toastOK(message: string) {
    toast.success(() => <div className={"toast-width"}>{message}</div>, {
      theme: "colored",
    });
  }

  handleDelete(mockResourceId: string) {
    this.setState({showDeleteModal: true});
    this.setState({mockResourceTarget: mockResourceId});
  }

  handleDeleteMockResourceInModal = (status: string) => {
    if (status === "ok") {
      axios.delete(`https://wt1wacwpzh.execute-api.eu-south-1.amazonaws.com/mocker/config/resources/${this.state.mockResourceTarget}`)
      .then((res) => {
        if (res.status === 200) {
          this.toastOK(
            "Resource deleted successfully! Refresh the page to see the changes."
          );
        }
      })
      .catch(() => {
        this.toastError(
          "An error occurred while deleting the mock resource..."
        );
      });
    } 
    this.setState({ showDeleteModal: false });
  }

  render() {
    let completeURL = `${this.props.item.subsystem}/${this.props.item.resource_url ? this.props.item.resource_url : ''}`.replace("//", "/");

    return (
      <>
      <tr>
        { 
          this.props.item.name.length > 40 &&
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip">{this.props.item.name}</Tooltip>}>
            <td className="text-left">
              {this.props.item.name.substring(0, 37)}...
            </td>              
          </OverlayTrigger>
        }
        {
          this.props.item.name.length <= 40 &&
          <td className="text-left">
            {this.props.item.name}
          </td> 
        }

        {
          completeURL.length > 40 &&
          <OverlayTrigger placement="top" overlay={<Tooltip id="button-tooltip">{completeURL}</Tooltip>}>
            <td className="text-left">
              {completeURL.substring(0, 37)}...
            </td>              
          </OverlayTrigger>
        }
        {
          completeURL.length <= 30 &&
          <td className="text-left">
            {completeURL}
          </td> 
        }
       
        <td className="text-center">
          {
            <span className="mr-0 badge badge-info">
              {this.props.item.http_method}
            </span>            
          }
        </td>

        <td className="text-center">
          <span className="mr-0 badge badge-secondary">
            {this.props.item.soap_action}
          </span>
        </td>

        <td className="text-center">
          {
            this.props.item.is_active &&     
            <FaThumbsUp className="mr-0" color="green" />
          }
          {
            !this.props.item.is_active &&  
            <FaThumbsDown className="mr-0" color="red" />
          }
        </td>

        <td className="text-center">
          {
            this.props.item.tags && this.props.item.tags.length > 0 &&
            Object.keys(this.props.item.tags).map((tag: any, index: number) => (
              <span key={index} className="mr-1 badge badge-success">
                {this.props.item.tags[tag]}
              </span>
            ))
          }
        </td>
        <td className="col-md-2 text-right">
          <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-details-${this.props.item.id}`}>Detail</Tooltip>}>
            <FaEye role="button" className="mr-3" onClick={() => this.redirectToShowMockResourceDetail(this.props.item.id)} />
          </OverlayTrigger>        
          <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-edit-${this.props.item.id}`}>Edit</Tooltip>}>
            <FaEdit role="button" className="mr-3"  onClick={() => this.redirectToEditMockResourceDetail(this.props.item.id)} />
          </OverlayTrigger>        
          <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-delete-${this.props.item.id}`}>Delete</Tooltip>}>
            <FaTrash role="button" className="mr-3"  onClick={() => this.handleDelete(this.props.item.id)} />
          </OverlayTrigger>
        </td>
      </tr>

      <ConfirmationModal show={this.state.showDeleteModal} handleClose={this.handleDeleteMockResourceInModal}>
        <p>Are you sure you want to delete this mock resource?</p>
        <ul>
            <li>Name: {this.props.item.name}</li>
            <li>Resource: [{this.props.item.http_method}] {this.props.item.resource_url}</li>
        </ul>
      </ConfirmationModal>
      </>
    );
  }
}
