export class userOptions {
  option_shouldOverrideDownloadLocation: boolean;
  option_enableMoneycontrol : boolean;
}

export function getDefaults(): userOptions {
  return {
    option_shouldOverrideDownloadLocation: false,
    option_enableMoneycontrol : false
  };
}
