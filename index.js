#!/usr/bin/env node

import inquirer from 'inquirer';
import { exec } from 'child_process';
import { createSpinner } from 'nanospinner';

const devices = []
const simulators = []
const devicesSectionTitle = '== Devices =='
const simulatorsSectionTitle = '== Simulators =='

// exec shell script
async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

// Step 1 Fetching Devices
async function fetchingDevices() {
  const spinner = createSpinner('Fetching your devices...').start();
  let progressStatusInDevices = true 

  let { stdout } = await sh('xcrun xctrace list devices');
  for (let line of stdout.split('\n')) {
    // console.log(line);
    if (line === devicesSectionTitle || line === '') {
    } else {
      if (progressStatusInDevices) {
        if (line === simulatorsSectionTitle) {
          progressStatusInDevices = false
        } else {
          devices.push(line)
        }
      } else {
        simulators.push(line)
      }
    }
  }
  spinner.success()
  askForSelection()
}

fetchingDevices()

// Step 2 Ask for user request
async function askForSelection() {
  const selectedUDID = await inquirer.prompt({ 
    name: 'selectedUDID',
    type: 'list',
    message: 'Select device you want to install',
    choices: devices
  });

  return handleDeviceStart(selectedUDID)
}

async function handleDeviceStart(udid) {
  console.log(udid)
}
