import React, { useEffect, useState } from 'react';
import './Dito.css';


const credentials = {
    accessKey: "6fae34bc7bec2afd",
    partnerSignature: "test.1654789763.YeM29Z83eFo2lsOLOsNmhEh7cfuDNF9ZoAHF9Ki7Nf_HPS1NJ5fq8MuuUnqKdi1B6mciw6Yo4Zb0M2NGd_ifIw",
    partnerId: "test",
    tryOnServer:  "https://vto.partners.api.ditto.com"

}
const Dito = () => {

    const [state, setstate] = useState({ status: null, data: null });
    const [products, setproducts] = useState(null);
    const [selectedProducts, setSelectedproducts] = useState(null);

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

    new window.Ditto.Scan(config, scanCallbacks);
    window.Ditto.getProducts({tryOnServer : config.tryOnServer , accessKey: config.accessKey, partnerSignature: config.partnerSignature}, (data) => {
        setproducts(data.ids)
        setSelectedproducts(data.ids[0])
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
                    "glassesId": selectedProducts
                }
        
        
                new window.Ditto.Overlay(OverlayConfig,overlayCallbacks); 
    }

    console.log(selectedProducts)
    return (
        <div className='dito-wrapper'>
            <div id="scan_frame" />
            {state.status == "SUCCESS" ? (
                <>
                    <div className='ditto-controls'>
                    <select value={selectedProducts} onChange={(e) =>setSelectedproducts(e.target.value) }>{
                        products.map((product) => {
                            return (
                                <option  value={product} key={product}>{product}</option>
                            )
                        })
                        }</select>
                    <button onClick={drawOverlay}>Try the Overlay</button>
                    </div>

                    <div style={{height: "640px"}} id="overlay_frame" />
                </>
            ) : null}

        </div>

    )
}

export default Dito