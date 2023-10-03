import { Card, ScrollableDiv } from "../CardConsts";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import { Folder, FolderOpen, InsertDriveFile } from "@mui/icons-material";

//displays the file system of the server's root directory
const File = (props) => {
    const { tree } = props;

    function renderTree(nodes) {
        return (
            <TreeItem key={nodes.path} nodeId={nodes.path} label={nodes.name}>
                {Array.isArray(nodes.children)
                ? nodes.children.map((node) => renderTree(node))
                : null}
            </TreeItem>
        );
    }

    return <>
        <Card>
            <b>file system</b>
            <ScrollableDiv>
                <TreeView
                    defaultCollapseIcon={<FolderOpen />}
                    defaultExpandIcon={<Folder />}
                    defaultEndIcon={<InsertDriveFile />}
                    defaultExpanded={['mc/data']}
                >
                    {tree ? renderTree(tree) : null}
                </TreeView>
            </ScrollableDiv>
        </Card>
    </>
}

export default File