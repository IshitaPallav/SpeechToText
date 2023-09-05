export default function TabControl(props){
    const {selected_tab=undefined, children=[]} = props;

    let titles = [];
    React.Children.forEach(children, child=>{
        const {title, tabid} = child.props;
        titles.push({title, tabid});
    })

    let selTab= titles && titles.length > 0 


    return (<div style={{display:'block', overflow:'hidden', width:'100%'}}>
        <div style={{display:'block', overflow:'hidden', width:'100%'}}>
        
        </div>
        <div style={{display:'block', overflow:'hidden', width:'100%'}}>
        
        </div>

    </div>)
}