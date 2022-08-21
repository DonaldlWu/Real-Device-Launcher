#!/usr/bin/env node

import inquirer from 'inquirer';
import { exec } from 'child_process';
import { createSpinner } from 'nanospinner';

const devices = []
const simulators = []
const devicesSectionTitle = '== Devices =='
const simulatorsSectionTitle = '== Simulators =='

fetchingDevices()

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

// Step 2 Ask for user request
async function askForSelection() {
  const selectedUDID = await inquirer.prompt({ 
    name: 'selectedUDID',
    type: 'list',
    message: 'Select device\n',
    choices: devices
  });

  return startProjectOnDeviceByUDID(selectedUDID)
}

// Step 3 Run npx script to build and run project on device
async function startProjectOnDeviceByUDID(selectedUDID) {
  const udid = await getDeviceUDIDString(selectedUDID)
  const spinner = createSpinner('Install and run on your devices...').start();
  const command = `npx react-native run-ios --udid ${udid}`
  try {
    let { stdout, stderr } = await sh(command)
    console.log(stderr)
    console.log(stdout)
  } catch (e) {
    console.log(e)
  }
  spinner.stop()
}


// Helpers 

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

async function getDeviceUDIDString(udid) {
  let totalStringFromObject = udid.selectedUDID
  let udidString = totalStringFromObject.split(' ')
    .join('§ §')
    .split('§')
    .filter(function(item) {
      return item != ' '
    })[2]
    .replace('(', '')
    .replace(')', '')
  return udidString
}


