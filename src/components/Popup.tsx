import React, { useEffect, useState } from "react";
import { Modal, SegmentedControl, Radio, Button, Divider, Box } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { SparklesIcon } from '@heroicons/react/outline';
import * as AES from "crypto-js/aes";
import * as enc from "crypto-js/enc-base64url";
import './css/Modal.css';

const Popup = ({ IsOpen, setIsOpen, mapKey }: any) => {
    const navigate = useNavigate();
    const [GameMode, setGameMode] = useState('standard');
    const [TimeLimit, setTimeLimit] = useState('0');
    function startGame() {
        let stringifiedSettings = JSON.stringify({ GameMode, TimeLimit });
        let encryptedSettings = AES.encrypt(stringifiedSettings, 'openguessisgreat').toString();
        let encryptedSettingsString = encodeURIComponent(encryptedSettings);
        document.location.href = '/guess?game=' + mapKey + '&settings=' + encryptedSettingsString;
    }
    /*
    useEffect(() => {
        console.log("%cChanged GameMode to: %c" + GameMode, "color: #ff6464; font-size: 1.5em;", "color: #fff; font-size: 1.5em; font-weight: bold;");
    }, [GameMode]);
    useEffect(() => {
        console.log("%cChanged Time Limiter to: %c" + TimeLimit, "color: #ff6464; font-size: 1.5em;", "color: #fff; font-size: 1.5em; font-weight: bold;");
    }, [TimeLimit]);
    */
    return (
        <div className="Modal">
            <Modal radius={'lg'} centered opened={IsOpen} onClose={() => setIsOpen(false)} overlayOpacity={0.75} overlayColor='black' transition="pop" transitionDuration={150} transitionTimingFunction="cubic-bezier(.05,.52,.41,1)" title="Settings">
                <div className='Modal--Items'>
                    <p className='Modal--Title'>Game Mode</p>
                    <SegmentedControl
                        value={GameMode}
                        onChange={setGameMode}
                        data={[
                            { label: 'Standard', value: 'standard' },
                            { label: 'No Move', value: 'nomove', disabled: true  },
                            { label: 'No View', value: 'noview', disabled: true },
                        ]}
                    />
                    <p className='Modal--Title'>Time Limit</p>
                    <div className='Modal--RadioGroup'>
                        <Radio.Group
                            className="Modal--TimeLimit--Group"
                            value={TimeLimit}
                            onChange={setTimeLimit}
                            spacing={'xs'}
                            >
                            <Radio className="Modal--TimeLimit" label="None" value="0" color="red" size="sm" />
                            <Radio className="Modal--TimeLimit" label="30s" value="31000" color="red" size="sm" />
                            <Radio className="Modal--TimeLimit" label="60s" value="61000" color="red" size="sm" />
                            <Radio className="Modal--TimeLimit" label="3m" value="181000" color="red" size="sm" />
                            <Radio className="Modal--TimeLimit" label="5m" value="301000" color="red" size="sm" />
                        </Radio.Group>
                    </div>
                    <Button onClick={() => startGame()} className="Modal--StartButton" leftIcon={<SparklesIcon className="w-4 h-4"/>} variant="light" color="red" radius="lg">
                        Start with these settings
                    </Button>
                </div>
            </Modal>
        </div>
    );
  };
export default Popup;

/*
<div className="Modal--Wrapper">
        <div className={`darkBG`} onClick={() => setIsOpen(false)} />
            <div className={`centered`}>
                <div className={`modal`}>
                    <div className={`modalHeader`}>
                        <h5 className={`heading`}>Dialog</h5>
                    </div>
                    <button className={`closeBtn`} onClick={() => setIsOpen(false)}>
                        Close
                    </button>
                    <div className={`modalContent`}>
                        Are you sure you want to delete the item?
                    </div>
                    <div className={`modalActions`}>
                        <div className={`actionsContainer`}>
                            <button className={`deleteBtn`} onClick={() => setIsOpen(false)}>
                                Delete
                            </button>
                            <button
                                className={`cancelBtn`}
                                onClick={() => setIsOpen(false)}
                                >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
*/