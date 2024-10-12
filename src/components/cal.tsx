"use client";
import Cal, { getCalApi } from "@calcom/embed-react";
  import { useEffect } from "react";
  export default function Calcom() {
	useEffect(()=>{
	  (async function () {
		const cal = await getCalApi({"namespace":"30min"});
		cal("ui", {"styles":{"branding":{"brandColor":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});
	  })();
	}, [])
	return <Cal namespace="30min"
	  calLink="itzmedhanu/30min"
	  style={{width:"100%",height:"20%",overflow:"scroll"}}
	  config={{"layout":"month_view"}}
    
	  
	/>;
  };

  