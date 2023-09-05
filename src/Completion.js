import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import React, { useState, useEffect } from 'react';
import FormFieldColumnWise from "./FormFieldColumnWise/FormFieldColumnWise";
import { FormField } from "./FormFields/FormField";
import { BsFillMicFill } from "react-icons/bs";
import './App.css';

const endpoint = process.env.REACT_APP_ENDPOINT;
const azureApiKey = process.env.REACT_APP_AZURE_API_KEY;

// const prompt = ["Below is a customer request that specifies what records they would like to see. Please generate a SQL query that selects \
//                  all columns from the table 'Data' and use the customer input for the where clause. Data is comprised of the following columns \
//                  with the types in parenthesis: name(string), date_of_birth(date), city(string), and state(string).\n\n {{user input}}"]

const fields = ["input"];

const mandatoryFields = {
  input: true
}
const fieldPrompts = {
  input: "Please enter an input.",
};

const Completion = (props) => {

  let { closeModal } = props;
  const [input, setInput] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [open, setOpen] = useState(false);
  let [currentField, setCurrentField] = useState(0);
  const [recognizer, setRecognizer] = useState(null);
  const [recognitionStarted, setRecognitionStarted] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [formOpen, setFormOpen] = useState(true);

  const [form, setForm] = useState({
    input: '',
  });

  const statRecognitionForField = (field) => {
    setRecognitionStarted(true);
    setIsRecognizing(true);
    setIsMicActive(true);

    var msg = new SpeechSynthesisUtterance();
    msg.text = fieldPrompts[field];
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

  const handleClose = () => {
    setOpen(false);
    closeModal(true);
  };


  useEffect(() => {
    if (recognitionResult !== '' && recognitionStarted) {
      recognizer.stopContinuousRecognitionAsync(() => {
        var result = recognitionResult;
        setForm((prevState) => ({
          ...prevState,
          [fields[currentField]]: recognitionResult,
        }));

        if (currentField + 1 <= fields.length) {
          setCurrentField(currentField + 1);

        }
        if (currentField === (fields.length - 1)) {
          speak("Your input has been captured, you can proceed to generate a query.");
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
    speechConfig.speechRecognitionLanguage = "en-US"; // Set the language to English
    var audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    var speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    setRecognizer(speechRecognizer);

    speechRecognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        var result = e.result.text; //removes .
        setRecognitionResult(result);
        setIsMicActive(false);
      }
    };
  };

  const generateSQL = async (event) => {

    event.preventDefault();
    setForm({
      input: '',
    });

    const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
    const deploymentId = "openai-ent-azure-sbx";
    const result = await client.getCompletions(deploymentId, `${form.input}\nSQL Query:`, {
      temperature: 0,
      maxTokens: 1000,
      stop: ';'
    });
  

    const generatedSQL = (result.choices[0].text.trim().replace(/` or `|```/g, '')) + ";";

    setSqlQuery(generatedSQL);
    setOpen(true);
    setRecognitionResult('');
    setRecognitionStarted(false);
    setIsMicActive(false);
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync();
    }

  };
  const isSubmitDisabled = () => {
    for (let field of fields) {
      if (mandatoryFields[field] && form[field] === '') {
        return true;
      }
    }
    return false;
  }

  return (formOpen ? (
    <div > <i><h4> <center>Provide a statement and generate an SQL query to interact with the database.</center></h4></i>
      <i><h4> <center>Please wait and speak only when the mic is turned RED.</center></h4></i>

      <FormFieldColumnWise labelColumnWidth="120px">
        <FormField label="Input" addRequiredLabel>
          <textarea
            rows={4} cols={40}
            required
            value={form.input}
            onChange={(e) => setForm({ ...form, input: e.target.value })}
            maxLength={1000}
            placeholder="1000 Character Limit"
          />
        </FormField>

      </FormFieldColumnWise>

      <div>
        <button onClick={startSpeechRecognition} disabled={recognitionStarted} className="speechBtn">
          Start Speech Recognition
          <BsFillMicFill style={{ color: isMicActive ? 'red' : 'white' }} />
        </button> <button type='submit' disabled={isSubmitDisabled()} className="speechBtn" onClick={generateSQL} >Submit</button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Generated SQL Query"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {sqlQuery}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  ) : null
  )
}

export default Completion;
