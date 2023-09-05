import React, { useState, useEffect } from 'react';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { BsFillMicFill } from 'react-icons/bs'
import './App.css';
import FormFieldColumnWise from './FormFieldColumnWise/FormFieldColumnWise';
import { FormField } from './FormFields/FormField';
import { state_options } from './Constants';

const fields = ["firstName", "middleName", "lastName", "city", "state", "DateOfBirth"];

const mandatoryFields = {
    firstName: true,
    middleName: false,
    lastName: true,
    city: false,
    state: false,
    DateOfBirth: true,
}
const fieldPrompts = {
    firstName: "Please enter first name.",
    middleName: "Please enter middle name.",
    lastName: "Please enter last name.",
    city: "Please enter city.",
    state: "Please enter state",
    DateOfBirth: "Please enter date of birth."
};


const SpeechToText = (props) => {
    let { closeModal } = props;
    const [form, setForm] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        city: '',
        state: '',
        DateOfBirth: '',
    });
    let [currentField, setCurrentField] = useState(0);
    const [recognizer, setRecognizer] = useState(null);
    const [recognitionStarted, setRecognitionStarted] = useState(false);
    const [recognitionResult, setRecognitionResult] = useState('');
    const [isRecognizing, setIsRecognizing] = useState(false);
    const [isMicActive, setIsMicActive] = useState(false);
    const [formOpen, setFormOpen] = useState(true);

    const isSubmitDisabled = () => {
        for (let field of fields) {
            if (mandatoryFields[field] && form[field] === '') {
                return true;
            }
        }
        return false;
    }

    const statRecognitionForField = (field) => {
        setRecognitionStarted(true);
        setIsRecognizing(true);
        setIsMicActive(true);

        var msg = new SpeechSynthesisUtterance();
        msg.text = currentField < (fields.length) ? fieldPrompts[field]
            : "All fields are done, you can proceed to submit the form.";
        msg.onend = function (event) {
            setTimeout(function () {
                recognizer.startContinuousRecognitionAsync();
            }) // 2 seconds pause to let user start speaking
        };
        window.speechSynthesis.speak(msg);
    };

    useEffect(() => {
        if (recognizer !== null && recognitionStarted === false && currentField < fields.length) {
            statRecognitionForField(fields[currentField]);
        }
    }, [recognizer, recognitionStarted, currentField]);

    useEffect(() => {
        if (recognitionResult !== '' && recognitionStarted) {
            recognizer.stopContinuousRecognitionAsync(() => {
                var result = recognitionResult;
                if (fields[currentField] === 'state') {
                    if (!state_options.includes(result)) {
                        speak("State not recognized, Please try again!");
                        statRecognitionForField(fields[currentField]);
                        return;
                    }
                }
                if (result.toLowerCase() === 'skip') {
                    if (mandatoryFields[fields[currentField]]) {
                        speak(fields[currentField] + " is mandatory and cannot be skipped.");
                        statRecognitionForField(fields[currentField]);
                        return;
                    }
                    else {
                        speak("Skipping " + fields[currentField]);
                        setCurrentField(currentField + 1);
                        setRecognitionResult('');
                        setRecognitionStarted(false);
                        return;
                    }
                }
                setForm((prevState) => ({
                    ...prevState,
                    [fields[currentField]]: recognitionResult,
                }));

                if (currentField + 1 <= fields.length) {
                    setCurrentField(currentField + 1);

                }
                if (currentField === (fields.length - 1)) {
                    if (result.toLowerCase() === 'skip') {
                        if (mandatoryFields[fields[currentField]]) {
                            speak(fields[currentField] + " is mandatory and cannot be skipped.");
                            statRecognitionForField(fields[currentField]);
                            return;
                        }
                        else {
                            speak("Skipping " + fields[currentField]);
                            setRecognitionResult('');
                            setRecognitionStarted(false);
                            return;
                        }
                    }
                    speak("All fields are done, you can proceed to submit the form.");
                }

                setRecognitionResult('');
                setRecognitionStarted(false);
                setIsMicActive(false);

            });
        }
    }, [recognitionResult, currentField, recognizer]);

    const speak = (text) => {
        var msg = new SpeechSynthesisUtterance();
        msg.text = text;
        window.speechSynthesis.speak(msg);
    }

    const startSpeechRecognition = () => {
        var region = process.env.REACT_APP_REGION
        var subscriptionKey = process.env.REACT_APP_SUBKEY
        setCurrentField(0);
        var speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
        // speechConfig.SetProperty(PropertyId.Speech_SegmentationSilenceTimeoutMs, "2000");
        speechConfig.speechRecognitionLanguage = "en-US"; // Set the language to English
        var audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
        var speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        setRecognizer(speechRecognizer);

        speechRecognizer.recognized = (s, e) => {
            if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
                var result = e.result.text.replace(/\.+$/, ''); //removes .
                setRecognitionResult(result);
                setIsMicActive(false);
            }
        };
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        props.onNewRelative(form); // Add this line

        setForm({
            firstName: '',
            middleName: '',
            lastName: '',
            city: '',
            state: '',
            DateOfBirth: '',
        });
        console.log(form.DateOfBirth);
        setRecognitionResult('');
        setRecognitionStarted(false);
        setIsMicActive(false);
        if (recognizer) {
            recognizer.stopContinuousRecognitionAsync();
        }
        closeModal(true);
    };

    return (
        <div > <i><h4> <center>Please wait and speak only when the mic is turned RED.</center></h4></i>
            <i><h5><center>You can say 'SKIP' to skip a field and move forward.</center></h5></i>
            <FormFieldColumnWise labelColumnWidth="120px">
                <FormField label="First Name" addRequiredLabel>
                    <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </FormField>
                <FormField label="Middle Name" >
                    <input type="text" value={form.middleName} onChange={(e) => setForm({ ...form, middleName: e.target.value })} />
                </FormField>
                <FormField label="Last Name" addRequiredLabel>
                    <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </FormField>
                <FormField label="City" >
                    <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </FormField>
                <FormField label="State">
                    <select value={form.state}
                        onChange={(e) => setForm({ ...form, state: e.target.value })}>
                        <option value="-1" key="-1" id="-1" ></option>
                        {
                            (state_options.map((state, index) => {
                                return (
                                    <option key={index} value={state}>{state}</option>
                                );
                            }))
                        }
                    </select>
                </FormField>
                <FormField label="Date of Birth" addRequiredLabel>
                    <input type="text" value={form.DateOfBirth} onChange={(e) => setForm({ ...form, DateOfBirth: e.target.value })} />
                </FormField>

            </FormFieldColumnWise>
            <div>

                <button onClick={startSpeechRecognition} disabled={recognitionStarted} className="speechBtn">
                    Start Speech Recognition
                    <BsFillMicFill style={{ color: isMicActive ? 'red' : 'white' }} />
                </button> <button type='submit' disabled={isSubmitDisabled()} className="speechBtn" onClick={handleSubmit} >Submit</button>
            </div>
        </div>
    );
}
export default SpeechToText;