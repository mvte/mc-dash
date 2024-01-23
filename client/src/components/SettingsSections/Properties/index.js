import { Grid } from '@mui/material';
import { Panel, P, ComboBox, SettingsInput, H1 } from '../SettingsConsts'

const testProperties = [
    {
        name: "test",
        value: "test",
        options: ["test", "test2", "test3"],
    },
    {
        name: "test2",
        value: "test2",
    },
    {
        name: "test3",
        value: "test3",
    },
    {
        name: "test4",
        value: "test4",
    },
    {
        name: "test5",
        value: "test5",
    }
]

const Properties = (props) => {

    // get actual properties from server (for now we use test properties)
    const properties = !props.properties.error ? props.properties : testProperties;
    
    //splice properties into two arrays
    const mid = Math.ceil(properties.length / 2);
    const leftProperties = properties.slice(0, mid);
    const rightProperties = properties.slice(mid, properties.length);

    if(rightProperties.length < leftProperties.length) {
        rightProperties.push({
            name: "",
            value: "",
            blank: true,
        })
    }

    const getInputComponentFromProperty = (property) => {
        if(property.options) {
            return <ComboBox 
                id={property.name}
                placeholder={property.value}
                options={property.options}
                disabled={property.readonly}
                onChange={props.onChange}
                onInputChange={props.onOptionsChange}
                value={props.formData[property.name] || null}
                onClear={props.onClear}
            />
        }
        else if (property.blank) {
            return <div style={{height: '30px', padding: '0px 10px',}}></div>
        } else {
            return <SettingsInput
                id={property.name}
                placeholder={property.value}
                disabled={property.readonly}
                fullWidth
                autoComplete="off"
                onChange={props.onChange}
                value={props.formData[property.name] || ""}
            />
        }
    }

    return (
        <div>
            <H1>properties</H1>
            <Grid container spacing={4} >
                <Grid item xs={6}>
                    <Panel>
                        <Grid container rowGap={3} >
                        {leftProperties.map((property, index) => (
                            <Grid container spacing={2} alignItems="center" key={index}>
                                <Grid item xs={4} >
                                    <P> {property.name} </P>
                                </Grid>
                                <Grid item xs={8}>
                                    {getInputComponentFromProperty(property)}
                                </Grid>
                            </Grid>
                        ))}
                        </Grid>
                    </Panel>
                </Grid>
                <Grid item xs={6}>
                    <Panel>
                        <Grid container rowGap={3} >   
                            {rightProperties.map((property, index) => (
                                <Grid container spacing={2} alignItems="center" key={index}>
                                    <Grid item xs={4} >
                                        <P> {property.name} </P>
                                    </Grid>
                                    <Grid item xs={8}>
                                        {getInputComponentFromProperty(property)}
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Panel>
                </Grid>
            </Grid>
        </div>
    )
}

export default Properties;