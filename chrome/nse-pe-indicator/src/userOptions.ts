export class userOptions {
  option_shouldOverrideDownloadLocation: boolean;
}

export function getDefaults(): userOptions {
  return {
    option_shouldOverrideDownloadLocation: false
  };
}
