//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

import * as $ from "jquery";
import * as Url from "url";

import { } from "../../@types/prompt-window";

const promptContext = moduleManager.getComponent("prompt-context");

$("#input-cluster-url").keyup(($event) => {
    let keyboardEvent = <KeyboardEvent>$event.originalEvent;

    if (keyboardEvent.code === "Enter") {
        $("#btn-connect").click();
    }
});

$("#input-connect-locally").change(($event) => {
    let $sender = $($event.target);
    if ($sender.prop("checked")) {
        $("#input-cluster-url").val("http://localhost:19080");
    }

    $("#input-cluster-url").prop("disabled", $sender.prop("checked"));
});

$("#btn-connect").click(() => {
    try {
        let url = Url.parse($("#input-cluster-url").val().toString());

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            alert("The protocol of the cluster url is not supported. Only HTTP and HTTPS are supported.");
            return;
        }

        promptContext.finish(url.protocol + "//" + url.host);
    } catch (error) {
        alert("The cluster url is not in a valid url format.");
    }
});

$("#btn-exit").click(() => promptContext.close());

$(document).ready(() => {
    $("#input-cluster-url").focus();
});
