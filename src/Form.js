import React from 'react';
import VideoJSComponent from './VideoJSComponent';
import WaveSurfer from 'wavesurfer.js';
import firebase from './firebase.js';
import { getDatabase, ref as ref_database, push } from 'firebase/database';
import { getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Form = () => {
    const playerRef = React.useRef(null);
    const videoJsOptions = {
        controls: true,
        bigPlayButton: false,
        width: 320,
        height: 240,
        fluid: false,
        plugins: {
            // wavesurfer section is only needed when recording audio-only
            wavesurfer: {
                backend: 'WebAudio',
                waveColor: '#36393b',
                progressColor: 'black',
                debug: true,
                cursorWidth: 1,
                msDisplayMax: 20,
                hideScrollbar: true,
                displayMilliseconds: true,
                plugins: [
                    // enable microphone plugin
                    WaveSurfer.microphone.create({
                        bufferSize: 4096,
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        constraints: {
                            video: false,
                            audio: true
                        }
                    })
                ]
            },
            record: {
                audio: true,
                video: true,
                maxLength: 10,
                debug: true
            }
        }
    };

    const handlePlayerReady = (player) => {
        playerRef.current = player;

        // handle player events
        // device is ready
        player.on('deviceReady', () => {
            console.log('device is ready!');
        });

        // user clicked the record button and started recording
        player.on('startRecord', () => {
            console.log('started recording!');
        });

        // user completed recording and stream is available
        player.on('finishRecord', () => {
            // recordedData is a blob object containing the recorded data that
            // can be downloaded by the user, stored on server etc.
            console.log('finished recording: ', player.recordedData);

            Swal.fire('', 'Thank you for your video! Please wait until the video is done uploading before clicking submit!', 'info')

            const file = player.recordedData;
            const storage = getStorage();
            const videoID = file.name;
            const videoRef = ref_storage(storage, 'video/' + videoID);

            const newURLS = [];
            uploadBytesResumable(videoRef, file).on('state_changed', function (snapshot) {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                // Handle unsuccessful uploads
                Swal.fire('', 'Video did not upload successfully.', 'error')
            }, function () {
                // Handle successful uploads on complete
                getDownloadURL(videoRef).then((url) => {
                    newURLS.push(url);
                });
                Swal.fire('', 'Video is done uploading. You may now click submit.', 'success')
            })

            setValues({
                video: newURLS
            })
        });

        // error handling
        player.on('error', (element, error) => {
            console.warn(error);
        });

        player.on('deviceError', () => {
            console.error('device error:', player.deviceErrorCode);
        });
    };

    const initialValues = {
        guestName: '',
        guestComment: '',
        time: '',
        video: []
    }

    const [values, setValues] = useState(initialValues);

    const videoPlayer = playerRef.current;

    // custom event handling
    const resetValues = () => {
        setValues({
            guestName: '',
            guestComment: '',
            timeStamp: '',
            video: []
        })
        document.querySelector('#guestName').value = '';
        document.querySelector('#guestComment').value = '';
        videoPlayer.record().reset();
        videoPlayer.recordedData = null;
    }

    const closeForm = () => {
        document.querySelector('.firstForm').style.display = 'none';
        document.querySelector('.secondForm').style.display = 'none';
        document.querySelector('.commentButton').style.display = 'block';
    }

    const openSecondForm = (event) => {
        event.preventDefault();

        if (videoPlayer.recordedData !== undefined && videoPlayer.recordedData !== null) {
            document.querySelector('.firstForm').style.display = 'none';
            document.querySelector('.secondForm').style.display = 'flex';
        } else {
            Swal.fire('', 'No video recorded. Please try again.', 'warning');
        }
    }

    const confirmClose = () => {
        if (videoPlayer.recordedData === undefined || videoPlayer.recordedData === null) {
            closeForm();
        } else if (window.confirm('You recorded a video but have not submitted. Clicking ok will erase your video.') === true) {
            closeForm();
            resetValues();
        }
    }

    const submitForm = (event) => {
        event.preventDefault();
        const database = getDatabase(firebase);
        const dbRef = ref_database(database);
        const nameToBeAdded = values.guestName;
        const commentToBeAdded = values.guestComment;
        const videoToBeAdded = values.video;

        const formatDate = function (date) {
            const time = new Date(date);
            const hh = time.getHours();
            const mm = time.getMinutes();
            let h = hh;
            let dd = "AM";
            let m = mm;
            if (h >= 12) {
                h = hh - 12;
                dd = "PM";
            }
            if (h === 0) {
                h = 12;
            }
            if (m < 10) {
                m = "0" + mm;
            }
            return `${h}:${m} ${dd}`
        }

        if (videoPlayer.recordedData !== undefined
            && videoPlayer.recordedData !== null
            && nameToBeAdded !== ''
            && commentToBeAdded !== '') {
            push(dbRef, {
                'name': nameToBeAdded,
                'comment': commentToBeAdded,
                'time': formatDate(Date.now()),
                'video': videoToBeAdded
            })
            resetValues();
            closeForm();
        } else {
            Swal.fire('', 'One or more fields are empty.', 'warning')
        }
    }

    const getInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setValues({
            ...values,
            [name]: value,
        })
    }

    // initialize animate on scroll
    AOS.init({
        duration: 1200,
    })

    return (
        <div className="forms">
            <form onSubmit={openSecondForm} className="firstForm">
                <FontAwesomeIcon icon={faXmark} className="close" onClick={confirmClose} />
                <div className="recordVideo">
                    <p className="stepOne"><span className="color">Step 1:</span> Record a video message</p>
                    <VideoJSComponent options={videoJsOptions} onReady={handlePlayerReady} />
                    <button type="next">Next</button>
                </div>
            </form>
            <form onSubmit={submitForm} className="secondForm">
                <FontAwesomeIcon icon={faXmark} className="close" onClick={confirmClose} />
                <div className="inputs">
                    <p className="stepTwo"><span className="color">Step 2:</span> Write a comment and sign your name</p>
                    <label htmlFor="guestComment">Message to the newly weds:</label>
                    <textarea id="guestComment" name="guestComment" type="text" onChange={getInput} value={values.comment} />
                    <label htmlFor="guestName">Signed:</label>
                    <input id="guestName" name="guestName" type="text" onChange={getInput} value={values.name} />
                    <p className="stepThree"><span className="color">Step 3:</span> Submit</p>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default Form;