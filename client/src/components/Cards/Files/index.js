import { Card } from "../CardConsts";

//displays the file system of the server's root directory
const File = (props) => {
    
    return <>
        <Card>
            <b>file system</b>
            <div>
                &gt; root
                <div>
                    &emsp;&gt; home
                    <div>
                        &emsp;&emsp;&gt; user
                    </div>
                </div>
            </div>
        </Card>
    </>
}

export default File