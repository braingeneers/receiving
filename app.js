const grx = {};

// eslint-disable-next-line no-unused-vars
function signIn(response) {
  const profile = response.getBasicProfile();
  grx.email = profile.getEmail();
  grx.name = profile.getName();
  console.log("User:", grx.email, grx.name);

  $("#name").html(grx.name);
  $("#email").html(grx.email);
  grx.assumeRoleWithWebIdentity({
    roleArn: "arn:aws:iam::238605363322:role/receiving-browser-role",
    idToken: response.getAuthResponse().id_token,
  });
  $("#fine-uploader-s3").show();
}

// eslint-disable-next-line no-unused-vars
function signOut() {
  $("#fine-uploader-s3").hide();
  // eslint-disable-next-line no-undef
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(console.log("User signed out."));
}

function assumeRoleWithWebIdentity(params) {
  grx.roleArn = params.roleArn || grx.roleArn;
  grx.providerId = params.providerId || grx.providerId;
  grx.idToken = params.idToken || grx.idToken;

  const assumeRoleParams = {
    RoleArn: grx.roleArn,
    RoleSessionName: "web-identity-federation",
    WebIdentityToken: grx.idToken,
  };

  if (grx.providerId) {
    assumeRoleParams.ProviderId = grx.providerId;
  }

  // eslint-disable-next-line no-undef
  const sts = new AWS.STS();
  sts.assumeRoleWithWebIdentity(assumeRoleParams,
                                params.callback || grx.updateCredentials);
  grx.sts = sts;
}

function getFuCredentials(data) {
  return {
    accessKey: data.Credentials.AccessKeyId,
    secretKey: data.Credentials.SecretAccessKey,
    sessionToken: data.Credentials.SessionToken,
    expiration: data.Credentials.Expiration,
  };
}

function updateCredentials(error, data) {
  if (!error) {
    $("#fine-uploader-s3").fineUploaderS3("setCredentials", grx.getFuCredentials(data));
  }
  // eslint-disable-next-line no-undef
  AWS.config.update({
    credentials: {
      // region: data.Credentials.Region,
      // region: "us-west-2",
      accessKeyId: data.Credentials.AccessKeyId,
      secretAccessKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken,
    },
  });
}

// eslint-disable-next-line prefer-arrow-callback
$(document).ready(function() {
  grx.assumeRoleWithWebIdentity = assumeRoleWithWebIdentity;
  grx.getFuCredentials = getFuCredentials;

  $("#fine-uploader-s3").fineUploaderS3({
    request: {
      endpoint: "https://receiving-treehouse-ucsc-edu.s3-us-west-2.amazonaws.com",
      // these are undefined at this point but should fill in just in case tags get lost
      // params: {
      //   email: grx.email,
      //   name: grx.name,
      // },
    },
    objectProperties: {
      acl: "private",
      // S3 key = hash of email + original file name + size so
      key: function (id) {
        // eslint-disable-next-line no-undef
        const uuid = getUUIDByString(grx.email + this.getName(id) + this.getSize(id));
        // eslint-disable-next-line no-undef
        return qq.format("{}", uuid);
      },
    },
    cors: {
      // all requests are expected to be cross-domain requests
      expected: true,

      // if you want cookies to be sent along with the request
      sendCredentials: true,
    },
    chunking: {
      enabled: true,
      concurrent: {
        enabled: true,
      },
      mandatory: true, // so we consistent
    },
    resume: {
      enabled: true,
    },
    validation: {
      itemLimit: 20,
      sizeLimit: 20 * 1073741824,
    },
    maxConnections: 5,
    callbacks: {
      onComplete: function(id, name, responseJSON, xhr) {
        const tags = {
          original_filename: name,
          uuid: this.getKey(id),
          submitter_email: grx.email.toLowerCase(),
          submitter_name: grx.name.toLowerCase(),
          etag: xhr.responseXML.getElementsByTagName("ETag")[0].textContent.slice(1, -1),
        };
        console.log("Tags:");
        console.log(tags);

        // eslint-disable-next-line no-undef
        const s3 = new AWS.S3({region: "us-west-2"});
        const params = {
          Bucket: "receiving-treehouse-ucsc-edu",
          Key: this.getKey(id),
          Tagging: {
            // eslint-disable-next-line prefer-arrow-callback
            TagSet: Object.keys(tags).map(function(key) {
              return {Key: key, Value: tags[key]};
            }),
          },
        };
        s3.putObjectTagging(params, (err, data) => {
          if (err) console.log(err, err.stack, data);
        });
        s3.putObject({
          Bucket: "receiving-treehouse-ucsc-edu",
          Key: this.getKey(id) + ".json",
          Body: JSON.stringify(tags, null, "  "),
        }, (err, data) => {
          if (err) console.log(err, err.stack, data);
        });
      },
      onAllComplete: (succeeded, failed) => {
        console.log("onAllComplete", succeeded, failed);
      },
    },
  })
  .on("complete", function(event, id, name, response) {
    const $fileEl = $(this).fineUploaderS3("getItemByFileId", id);
    const $viewBtn = $fileEl.find(".view-btn");
    if (response.success) {
      $viewBtn.show();
    }
  })
  .on("credentialsExpired", () => {
    // eslint-disable-next-line no-undef
    const promise = new qq.Promise();

    // Grab new credentials
    grx.assumeRoleWithWebIdentity({
      callback: (error, data) => {
        if (error) {
          promise.failure("Failed to assume role");
        } else {
          promise.success(grx.getFuCredentials(data));
        }
      },
    });

    return promise;
  });

  grx.updateCredentials = updateCredentials;

  $(document).on("tokenExpired.s3Demo", () => {
    $("#fine-uploader-s3").hide();
  });

  $(document).on("tokenReceived.s3Demo", () => {
    $("#fine-uploader-s3").show();
  });

  $(document).trigger("tokenExpired.s3Demo");
});
