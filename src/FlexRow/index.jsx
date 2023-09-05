import React from "react";

const FlexRow = (props)=>{
    const {inlineStyle={}} = props;
    return (<div style={{...{display:'flex', flexDirection:'row', flexGap:'8px', overflow:'hidden'}, ...inlineStyle}}>{props.children && props.children.length > 0 && props.children.map((child)=>(<div style={{marginLeft:'18px'}}>{child}</div>))}</div>)
}

export default FlexRow;