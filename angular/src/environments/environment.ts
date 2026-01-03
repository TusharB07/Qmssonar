// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: "http://localhost:8000/api/v1",
  apiUrl: "http://[::1]:3000",
  staticUrl: "http://localhost:8000/uploads/img",
  FGI_RAZOR_PAY_API_KEY: "rzp_live_XiwOaOFeU9raRs",
  FGI_RAZOR_PAY_KEY_SECRET : 'yQNzzOfbRJ3JKi6qaF2KRDP8',
  backendEmailFrom:"alwritesupport@alwrite.co",
  isLokton:true,
};
