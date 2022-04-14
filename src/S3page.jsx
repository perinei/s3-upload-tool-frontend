import { Auth, Storage } from 'aws-amplify';
import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { DataGrid } from '@material-ui/data-grid'
import './App.css';

const grayscale = 200
const graycolor = 'rgba(' + grayscale + ', ' + grayscale + ',' + grayscale + ', 0.9)'
const useStyles = makeStyles({
    root: {
        '& .super-app-theme--header': {
            backgroundColor: graycolor,
        },
    },
});

function S3page(props) {

    const [filename, setFilename] = useState("Click to choose a file")
    const [color, setColor] = useState("secondary")
    const [showUpload, setShowUpload] = useState(false)
    const [open, setOpen] = useState(false);
    const [lastfileuploaded, setLastfileuploaded] = useState("");
    const [sortModel, setSortModel] = useState([
        {
            field: 'lastModified',
            sort: 'desc',
        },
    ]);
    const classes = useStyles();
    async function signOut() {
        await Auth.signOut()
        window.location.replace('/');
    }
    const [email, setEmail] = React.useState("")
    const [nickname, setNickname] = React.useState("")
    const [bucketcontent, setbucketcontent] = React.useState([])
    const handleClickOpen = async (lastfileuploaded) => {
        setOpen(true);
        setLastfileuploaded(lastfileuploaded)
    };
    const handleClose = async () => {
        setOpen(false);
    };

    React.useEffect(() => {
        async function ini() {
            const credentials = await Auth.currentCredentials();
            let authUser = ""
            try {
                authUser = await Auth.currentAuthenticatedUser({ bypassCache: true })
                // console.log(authUser)
            }
            catch (e) {
                window.location.replace("/");
            }
            setEmail(authUser.attributes.email)
            setNickname(authUser.attributes.nickname)
            const result = await Storage.list('')
            result.forEach(function (item, index) {
                item.id = index;
            });
            setbucketcontent(result)
        }
        ini()
    }, [])

    async function handleUpload() {
        let authUser = ""
        try {
            authUser = await Auth.currentAuthenticatedUser({ bypassCache: true })
        }
        catch (e) {
            window.location.replace("/");
        }
        const file1 = document.getElementById('fileupload').files;

        if (!file1.length) {
            alert('Please choose a file to upload first.');
            return
        }
        const file = file1[0]
        try {
            file_with_spaces = file.name
            file_no_spaces = file_with_spaces(" ","_")
            await Storage.put(email + "/" + nickname + "/" + file_no_spaces, file, {});
            await handleClickOpen(file.name)
            const result = await Storage.list('')
            document.getElementById('fileupload').value = ''
            setShowUpload(false)
            setFilename('Click to choose a file')
            setColor("secondary")
            result.forEach(function (item, index) {
                item.id = index;
            });
            setbucketcontent(result)
        } catch (error) {
            window.location.replace("/");
        }
    }

    async function filemudou() {
        let authUser = ""
        try {
            authUser = await Auth.currentAuthenticatedUser({ bypassCache: true })
            console.log(authUser)
        }
        catch (e) {
            window.location.replace("/");
        }
        const file1 = document.getElementById('fileupload').files;
        if (!file1.length) {
            setFilename("CLICK TO CHOOSE A FILE")
            setColor("secondary")
            setShowUpload(false)
            return
        }
        const file = file1[0]
        setFilename(file.name)
        setColor("default")
        setShowUpload(true)
    }

    const columns = [
        {
            field: 'id',
            headerName: ' ',
            width: 100,
            valueGetter: (params) => ``,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'keya',
            headerName: 'File Name',
            width: 900,
            valueGetter: (params) =>
                `${params.getValue(params.id, 'key').split('/')[2] || ''}`,
            headerClassName: 'super-app-theme--header',

        },
        {
            field: 'lastModified',
            headerName: 'Date',
            type: 'dateTime',
            width: 500,
            headerClassName: 'super-app-theme--header',
        },
        {
            field: 'size',
            headerName: 'Size in Bytes',
            type: 'number',
            width: 200,
            headerClassName: 'super-app-theme--header',

        },

    ];

    async function updateModel(currentmodel) {
        const equalsIgnoreOrder = (a, b) => {
            if (a.length !== b.length) return false;
            const uniqueValues = new Set([...a, ...b]);
            for (const v of uniqueValues) {
                const aCount = a.filter(e => e === v).length;
                const bCount = b.filter(e => e === v).length;
                if (aCount !== bCount) return false;
            }
            return true;
        }
        if (!equalsIgnoreOrder(currentmodel, sortModel)) {
            setSortModel(currentmodel)
        } else {

        }
    }

    return (
        <div>
            <br></br>
            <div id='parent' style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                <div></div>
                <div><h3>File Submission Tool</h3></div>
                <div></div>
            </div>
            <div id='parent' style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                <div></div>
                <div>{nickname} - {email}&emsp;<Button onClick={signOut} style={{ color: '#FF5F58' }} variant='outlined'>Sign out</Button>&emsp;</div>
            </div>
            <div id='parent' style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between' }}>
                <div></div>
                <div>
                    {showUpload && <Button variant="contained" color="primary" onClick={handleUpload}>Click to Upload</Button>}&emsp;
                    <Button
                        variant="contained"
                        component="label"
                        color={color}
                    >
                        {filename}
                        <input id="fileupload"
                            type="file"
                            hidden
                            onChange={filemudou}
                        />
                    </Button>
                </div>
                <div></div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        File {lastfileuploaded} successfully uploaded
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <div style={{ height: 700, width: '100%' }} className={classes.root}>
                <DataGrid
                    // autoHeight
                    pagination
                    autoPageSize
                    sortModel={sortModel}
                    rows={bucketcontent}
                    columns={columns}
                    // pageSize={5}
                    // rowsPerPageOptions={[1000]}
                    // checkboxSelection                  
                    onSortModelChange={(model) => updateModel(model)}
                    disableSelectionOnClick

                />
            </div>
        </div >
    );
}
export default S3page
