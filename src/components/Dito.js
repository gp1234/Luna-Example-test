import React, { useEffect, useState } from 'react'


const credentials = {
    accessKey: "6fae34bc7bec2afd",
    partnerSignature: "test.1654726014.EMEyj8iCcpkJAEcVNU6KEVstNMPh5zA5QIeePx3DeVxflnx2Rh8ufYzF1jc4MQjRkZhQE2tDzwQa9MaVkNsz1g",
    partnerId: "test",
    tryOnServer:  "https://vto.partners.api.ditto.com"

}
const Dito = () => {

    const [state, setstate] = useState({ status: null, data: null });
    const [products, setproducts] = useState(null);

    useEffect(() => {
        const scanCallbacks = {
            success: data => setstate({ status: "SUCCESS", data: data }),
            progress: data => setstate({ status: data.status, data: data }),
            failure: data => setstate({ status: data.status, data: data }),
            close: data => setstate({ status: data.status, data: data }),
            faceiq_result: data => console.log(data),
        };

        const config = {

            "tryOnServer": credentials.tryOnServer,
            "domSelector": "#scan_frame",
            "accessKey": credentials.accessKey,
            "partnerSignature": credentials.partnerSignature,
            "partnerId": credentials.partnerId,
            "disableClose": false,
            "enableFaceInsights": true

        }

   const ditto =   new window.Ditto.Scan(config, scanCallbacks);
    window.Ditto.getProducts({tryOnServer : config.tryOnServer , accessKey: config.accessKey, partnerSignature: config.partnerSignature}, (data) => {
        setproducts(data.ids)
     });

    }, []);

    const drawOverlay = () => {

                const overlayCallbacks = {
                    success: e => console.log("Overlay created"),
                    progress: d => console.log(d),
                    failure: e => console.error('scan fail', e),
                    close: ev => console.log('close', ev),
                    faceiq_result: d => console.log(d),
                };
        
                const OverlayConfig =   {
                    "tryOnServer": credentials.tryOnServer,
                    "domSelector": "#overlay_frame",
                    "accessKey": credentials.accessKey,
                    "partnerId": credentials.partnerId,
                    "scanId": state.data.scanId,
                    "overlaySignature": state.data.overlaySignature,
                    "disablePreview": true,
                    "glassesId": "big_glasses"
                }
        
        
                new window.Ditto.Overlay(OverlayConfig,overlayCallbacks); 
    }

    return (
        <div>
            <div id="scan_frame" />
            {state.status == "SUCCESS" ? (
                <>
                    <button onClick={drawOverlay}>Try the Overlay</button>
                    <div style={{height: "640px"}} id="overlay_frame" />
                </>
            ) : null}

        </div>

    )
}

export default Dito