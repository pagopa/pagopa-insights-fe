import { Help } from "@mui/icons-material"
import { Tooltip } from "@mui/material"
import React, { ReactNode } from "react"

export const getSpecialHeadersTooltip = () => {
    return getHelpTooltip(
        <>This field represents the set of special headers to be tightly bound to the mock resource.<br/><br/>
        If a request is compliant with the mock resource and contains these headers with the defined values, Mocker may evaluate the mock rules and return a response.<br/><br/>
        If a request does not have all the headers defined with the same set values, Mocker does not consider the request to be compliant with this mock resource.<br/><br/>
        The evaluation of the headers and their values in the request is case insensitive. </>
    );
} 

export const getActivationStatusTooltip = () => {
    return getHelpTooltip(
        <> This field represents the activation status of the mock resource.<br/><br/>
        If the mock resource is in "active" state, Mocker can evaluate its rules if the request is compliant with this resource.<br/><br/>
        If the mock resource is in "inactive" state, Mocker does not evaluate the rules that make it up and returns a generic error message.</>
    );
}

export const getRuleConditionTooltip = () => {
    return getHelpTooltip(
        <>This field represents the list of conditions, sequentially analyzed in AND, that a request must follows in order to receive the mock response defined for this rule.</>
    );
}

export const getInjectedParameterTooltip = () => {
    return getHelpTooltip(
        <>These fields represents the set of parameter that can be injected in the response body.<br/><br/>
        These parameters are taken from request body and can be used for dynamic values in mock response using the format {'${NAME}'}.<br/><br/>
        If no value is retrievable from request, the field value is set as empty.</>
    );
}

export const getHelpTooltip = (text: ReactNode) => {
    return (
        <Tooltip title={<div>{text}</div>}>
          <Help sx={{ color: "#61affe", paddingLeft: '5px' }}></Help>
        </Tooltip>
    );
}