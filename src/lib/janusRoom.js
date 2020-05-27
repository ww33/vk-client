import Janus from "./janus";

const volumeMeter = require("volume-meter");

window.AudioContext = window.AudioContext || window.webkitAudioContext;

let config = {
  remotestreams: {},
  feeds: [],
  bitrateTimer: []
};

const dataChunk = 65536;
let dataBuffer = "";

// TODO Remove unused events / functions

// Helpers
function getQueryStringValue(name) {
  name = name.replace(/[\[]/, "\\[")
    .replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
  const results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function startOwnFeed(opts, cb) {
  //alert('>>>>>>>>>>>>>>>>>> PUBLISH OWN FEED');
  opts = opts || {};
  // Publish our stream
  config.isShareScreenActive = false;
  config.videoRoomHandler.createOffer(
    {
      // Add data:true here if you want to publish datachannels as well
      media: {
        //video: opts.video || null,
        video: "lowres",
        audioRecv: false, // Publishers are sendonly
        videoRecv: false, // Publishers are sendonly
        audioSend: opts.audioSend,
        videoSend: opts.videoSend
        /*
        replaceVideo: opts.replaceVideo,
        replaceAudio: opts.replaceAudio,
        */
        //data: true,
      },
      simulcast: opts.simulcast || false,
      simulcastMaxBitrates: {
        high: 400000,
        medium: 120000,
        low: 80000
      },
      success: function(jsep) {
        Janus.debug("Got publisher SDP!");
        Janus.debug(jsep);
        const publish = {
          "request": "publish",
          "audio": opts.audioSend,
          "video": opts.videoSend
          //"data": true
        };
        if (config.token) {
          publish.token = config.token;
        }
        config.videoRoomHandler.send({
          "message": publish,
          "jsep": jsep
        });
        if (cb) {
          cb();
        }
      },
      error: function(error) {
        Janus.error("WebRTC error:", error);
        if (opts && opts.audioSend) {
          startOwnFeed({
            audioSend: false
          });
        } else {
          config.onError("WebRTC error", error);
        }
      }
    });
}

function stopOwnFeed() {
  return new Promise((resolve, reject) => {
    const unpublish = {
      "request": "unpublish"
    };
    if (config.token) unpublish.token = config.token;
    config.videoRoomHandler.send({
      "message": unpublish,
      success: function() {
        resolve();
      },
      error: function(err) {
        reject(err);
      }
    });
  });
}

function shareScreen(cb) {
  // Publish our stream
  config.videoRoomHandler.createOffer({
    // Add data:true here if you want to publish datachannels as well
    media: {
      video: "screen",
      //screenshareFrameRate: 25,
      videoRecv: false,
      audioSend: true,
      videoSend: true
      //data: true
    }, // Publishers are sendonly
    success: function(jsep) {
      Janus.debug("Got publisher SDP!");
      Janus.debug(jsep);
      const publish = {
        "request": "configure",
        "audio": true,
        "video": true
        //"data": true
      };
      if (config.token) publish.token = config.token;
      config.isShareScreenActive = true;
      config.videoRoomHandler.send({
        "message": publish,
        "jsep": jsep
      });
    },
    error: function(error) {
      Janus.error("WebRTC error:", error);
      if (cb) {
        cb(error);
      }
    }
  });
}

/*
function startRecording(options) {
  config.recordPlayHandler.send({
    'message': {
      'request': 'configure',
      'video-bitrate-max': 1024 * 1024, // a quarter megabit
      'video-keyframe-interval': 15000 // 15 seconds
    }
  });
  config.recordPlayHandler.createOffer(
    {
      // By default, it's sendrecv for audio and video... no datachannels
      // If you want to test simulcasting (Chrome and Firefox only), then
      // pass a ?simulcast=true when opening this demo page: it will turn
      // the following 'simulcast' property to pass to janus.js to true
      simulcast: doSimulcast,
      success: function (jsep) {
        Janus.debug('Got SDP!');
        Janus.debug(jsep);
        const body = {
          'request': 'record',
          'name': options.name || 'janus-room-test-' + (new Date()).valueOf(),
        };
        config.recordPlayHandler.send({
          'message': body,
          'jsep': jsep
        });
      },
      error: function (error) {
        Janus.error('WebRTC error...', error);
        alert('WebRTC error... ' + error);
        config.recordPlayHandler.hangup();
      }
    });
}
*/

/*
function stopPlayback() {
  return new Promise((resolve, reject) => {
    const stop = {
      'request': 'stop',
    };
    config.recordPlayHandler.send({
      'message': stop,
      success: function () {
        resolve();
      },
      error: function (err) {
        reject(err);
      }
    });
  });
}
*/

//let vrpCallback = null;

function createRoomHandler(callbacks) {
  config.janus.attach({
    plugin: "janus.plugin.videoroom",
    opaqueId: config.opaqueId,
    success: function(pluginHandle) {
      config.videoRoomHandler = pluginHandle;
      Janus.log("Plugin attached! (" + config.videoRoomHandler.getPlugin() + ", id=" + config.videoRoomHandler.getId() + ")");
      Janus.log("  -- This is a publisher/manager");
      callbacks.resolve();
    },
    error: function(error) {
      Janus.error("  -- Error attaching plugin...", error);
      config.onError("Error attaching plugin", error);
    },
    consentDialog: function(on) {
      Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
      if (on) {
        // Darken screen and show hint
      } else {
        // Restore screen
      }
    },
    mediaState: function(medium, on) {
      // FIXME Be aware, in Chrome, this on signal is not always true
      Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);

    },
    webrtcState: function(on) {
      Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
    },
    onmessage: function(msg, jsep) {
      //console.debug(">>>>>> LOCAL MESSAGE <<<<<<<", msg, jsep);
      let remoteFeed;
      let list;
      let id;
      let display;
      let video;
      let audio;
      let f;
      Janus.debug(" ::: Got a message (publisher) :::");
      Janus.debug(msg);
      Janus.debug(jsep);
      if (config.videoRoomHandler) {
        config.videoRoomHandler.alive = true;
      }

      const event = msg["videoroom"];
      Janus.debug("Event: " + event);
      if (event !== undefined && event != null) {
        if (event === "joined" && !config.isShareScreenActive) {
          console.log("JOIN", msg);
          // Publisher/manager created, negotiate WebRTC and attach to existing feeds, if any
          config.myid = msg["id"];
          config.mypvtid = msg["private_id"];
          config.description = msg["description"];
          Janus.log("Successfully joined room " + msg["room"] + " with ID " + config.myid);

          if (config.ridHandler && typeof config.ridHandler == "function") {
            config.ridHandler(config.myid);
          }
          // Any new feed to attach to?
          if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
            list = msg["publishers"];
            Janus.debug("Got a list of available publishers/feeds:");
            Janus.debug(list);
            for (f in list) {
              id = list[f]["id"];
              display = list[f]["display"];
              audio = list[f]["audio_codec"];
              video = list[f]["video_codec"];
              Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
              newRemoteFeed(id, display, audio, video);
            }
          }
        } else if (event === "slow_link") {
          console.warn("slowlink", msg);
          /*
          const bandwidth = msg['current-bitrate'];
          if (bandwidth !== 0) {
            if (config.onWarning) config.onWarning(msg);
            // Janus detected issues when receiving our media, let's slow down
            if (!config.isShareScreenActive) {
              let bandwidth = bandwidth / 1.5;
              config.videoRoomHandler.send({
                'message': {
                  'request': 'configure',
                  'video-bitrate-max': bandwidth, // Reduce the bitrate
                  'video-keyframe-interval': 15000 // Keep the 15 seconds key frame interval
                }
              });
            }
          }
          */
        } else if (event === "destroyed") {
          // The room has been destroyed
          Janus.warn("The room has been destroyed!");
          config.onDestroyed();
        } else if (event === "event") {
          // Any new feed to attach to?
          if (msg["publishers"] !== undefined && msg["publishers"] !== null) {
            list = msg["publishers"];
            Janus.debug("Got a list of available publishers/feeds:");
            Janus.debug(list);
            for (f in list) {
              id = list[f]["id"];
              display = list[f]["display"];
              audio = list[f]["audio_codec"];
              video = list[f]["video_codec"];
              Janus.debug("  >> [" + id + "] " + display + " (audio: " + audio + ", video: " + video + ")");
              newRemoteFeed(id, display, audio, video);
            }
          } else if (msg["leaving"] !== undefined && msg["leaving"] !== null) {
            // One of the publishers has gone away?
            const leaving = msg["leaving"];
            if (leaving === "ok") {
              console.log("Room Leaved", msg["room"]);
              if (typeof config.leaving === "function") {
                config.leaving();
              }
            } else {
              Janus.log("Publisher left: " + leaving);
              remoteFeed = null;
              for (let i = 1; i < config.publishers; i++) {
                if (config.feeds[i] != null && config.feeds[i] !== undefined && config.feeds[i].rfid === leaving) {
                  remoteFeed = config.feeds[i];
                  break;
                }
              }
              if (remoteFeed != null) {
                Janus.debug("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");
                config.feeds[remoteFeed.rfindex] = null;
                remoteFeed.detach();
              }
            }
          } else if (msg["unpublished"] !== undefined && msg["unpublished"] !== null) {
            // One of the publishers has unpublished?
            const unpublished = msg["unpublished"];
            Janus.log("Publisher left: " + unpublished);
            if (unpublished === "ok") {
              // That's us
              config.videoRoomHandler.hangup();
              return;
            }
            remoteFeed = null;
            for (let i = 1; i < config.publishers; i++) {
              if (config.feeds[i] != null && config.feeds[i] !== undefined && config.feeds[i].rfid === unpublished) {
                remoteFeed = config.feeds[i];
                break;
              }
            }
            if (remoteFeed != null) {
              Janus.debug("Feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") has left the room, detaching");
              config.feeds[remoteFeed.rfindex] = null;
              remoteFeed.detach();
            }
          } else if (msg["error"] !== undefined && msg["error"] !== null) {
            console.error(msg);
            if (msg["error_code"] === 426) {
              config.onError("The room is unavailable.");
            } else {
              config.onError(msg["error"], msg["error_code"]); //TODO make normal
            }
          }
        }
      }
      if (jsep !== undefined && jsep !== null) {
        Janus.debug("Handling SDP as well...");
        Janus.debug(jsep);
        config.videoRoomHandler.handleRemoteJsep({
          jsep: jsep
        });
        // Check if any of the media we wanted to publish has
        // been rejected (e.g., wrong or unsupported codec)
        audio = msg["audio_codec"];
        if (config.mystream && config.mystream.getAudioTracks() && config.mystream.getAudioTracks().length > 0 && !audio) {
          // Audio has been rejected
          Janus.debug("Our audio stream has been rejected, viewers won't hear us");
        }
        video = msg["video_codec"];
        if (config.mystream && config.mystream.getVideoTracks() && config.mystream.getVideoTracks().length > 0 && !video) {
          // Video has been rejected
          Janus.debug("Our video stream has been rejected, viewers won't see us");
          // Hide the webcam video
        }
      }
    },
    onlocalstream: function(stream) {
      Janus.debug(" ::: Got a local stream :::");
      //config.mystream = window.mystream = stream; // attach to global for debugging purpose
      config.mystream = stream; // attach to global for debugging purpose
      if (config.mystream.getVideoTracks().length > 0) {
        config.mystream.getVideoTracks()[0].onended = function() {
          //if (config.isShareScreenActive && config.publishOwnFeed) {
          if (config.isShareScreenActive) {
            //alert("Put back the webcam");
            console.log("Put back the webcam");
            startOwnFeed({
              audioSend: true,
              videoSend: true,
              replaceVideo: true,
              replaceAudio: true
            });
          }
        };
      }
      Janus.debug(stream);
      config.onLocalJoin(stream);

      if (Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "firefox") {
        if (config.onVolumeMeterUpdate) {
          const ctx = new AudioContext();
          const meter = volumeMeter(ctx, {
            tweenIn: 2,
            tweenOut: 6,
            skip: config.volumeMeterSkip
          }, (volume) => {
            config.onVolumeMeterUpdate(0, volume);
          });
          const src = ctx.createMediaStreamSource(config.mystream);
          src.connect(meter);
          config.mystream.onended = meter.stop.bind(meter);
        }
      }
    },
    onremotestream: function(stream) {
      console.error("STRANGE!!", stream)
      // The publisher stream is sendonly, we don't expect anything here
    },
    ondataopen: function(data) {
      //local data feed
      if (config.onLocalDataOpen) {
        config.onLocalDataOpen(data);
      }
    },
    oncleanup: function() {
      Janus.log(" ::: Got a cleanup notification: we are unpublished now :::");
      config.mystream = null;
    },
    ondata: function(data) {
      console.log("LDR", data);
      if (data.indexOf("SessionHandler") !== -1) {
        return;
      }
      try {
        data = JSON.parse(data);
        config.onMessage(data);
      } catch (err) {
        config.onMessage({
          error: `Failed to parse JSON : ${err}`
        });
      }
    }
  });
}

function start(callbacks) {
  return new Promise((resolve, reject) => {
    try {
      // Make sure the browser supports WebRTC
      if (!Janus.isWebrtcSupported()) {
        config.onError("No WebRTC support... ");
        return;
      }
      // Create session
      config.janus = new Janus({
        server: config.server,
        token: config.token,
        connectionInit: () => {
          callbacks.connectionInit();
        },
        connectionLost: () => {
          callbacks.connectionLost();
        },
        connectionRestored: () => {
          callbacks.connectionRestored();
        },
        success: () => {
          createRoomHandler({
            resolve: () => callbacks.resolve()
          });
        },
        error: function(error) {
          if (config.videoRoomHandler) {
            config.videoRoomHandler.alive = false;
          }
          config.onError("Error", error);
          reject(error);
        },
        destroyed: function() {
          //console.log('Destroyed');
        },
        iceServers: config.iceServers
      });
    } catch (err) {
      reject(err);
    }
  });
}

function newRemoteFeed(id, display, audio, video) {
  //console.log(">>>>>>>>>>>>>>>>>", id, display, audio, video);
  // A new feed has been published, create a new plugin handle and attach to it as a subscriber
  let remoteFeed = null;
  config.janus.attach(
    {
      plugin: "janus.plugin.videoroom",
      opaqueId: config.opaqueId,
      success: function(pluginHandle) {
        remoteFeed = pluginHandle;
        remoteFeed.simulcastStarted = false;
        Janus.log("Plugin attached! (" + remoteFeed.getPlugin() + ", id=" + remoteFeed.getId() + ")");
        Janus.log("  -- This is a subscriber");
        // We wait for the plugin to send us an offer
        const subscribe = {
          "request": "join",
          "room": config.room,
          "ptype": "subscriber",
          "feed": id,
          "private_id": config.mypvtid
        };
        if (config.token) listen.token = config.token;
        // In case you don't want to receive audio, video or data, even if the
        // publisher is sending them, set the 'offer_audio', 'offer_video' or
        // 'offer_data' properties to false (they're true by default), e.g.:
        // 		listen["offer_video"] = false;
        // For example, if the publisher is VP8 and this.is Safari, let's avoid video
        if (Janus.webRTCAdapter.browserDetails.browser === "safari" &&
          (video === "vp9" || (video === "vp8" && !Janus.safariVp8))) {
          if (video) {
            video = video.toUpperCase();
          }
          console.warn("Publisher is using " + video + ", but Safari doesn't support it: disabling video");
          subscribe["offer_video"] = false;
        }
        remoteFeed.videoCodec = video;
        remoteFeed.send({"message": subscribe});

        // Setup DataChannel
        const body = {
          "request": "setup"
        };

        if (config.token) body.token = config.token;
        pluginHandle.send({
          "message": body
        });

      },
      error: function(error) {
        Janus.error("  -- Error attaching plugin...", error);
        config.onError("Error attaching plugin", error);
      },
      onmessage: function(msg, jsep) {
        Janus.debug(" ::: Got a message (subscriber) :::");
        Janus.debug(msg);
        if (config.videoRoomHandler) {
          config.videoRoomHandler.alive = true;
        }
        const event = msg["videoroom"];
        Janus.debug("Event: " + event);
        if (msg["error"] !== undefined && msg["error"] !== null) {
          config.onError("Error", msg["error"]);
        } else if (event !== undefined && event != null) {
          if (event === "attached") {
            // Subscriber created and attached
            for (let i = 1; i < config.publishers; i++) {
              if (config.feeds[i] === undefined || config.feeds[i] === null) {
                config.feeds[i] = remoteFeed;
                remoteFeed.rfindex = i;
                break;
              }
            }
            remoteFeed.rfid = msg["id"];
            remoteFeed.rfdisplay = msg["display"];
            remoteFeed.rfprofile = msg["profile"];
            Janus.log("Successfully attached to feed " + remoteFeed.rfid + " (" + remoteFeed.rfdisplay + ") in room " + msg["room"], remoteFeed.rfprofile);
          } else if (event === "event") {
            // Check if we got an event on a simulcast-related event from publisher
            //console.log("EVENT", msg);
            const subStream = msg["substream"];
            const temporal = msg["temporal"];
            if ((subStream !== null && subStream !== undefined) || (temporal !== null && temporal !== undefined)) {
              if (!remoteFeed.simulcastStarted) {
                remoteFeed.simulcastStarted = true;
                // Add some new buttons
                //this.addSimulcastButtons(remoteFeed.rfindex, remoteFeed.videoCodec === 'vp8');
              }
              // We just received notice that there's been a switch, update the buttons
              //this.updateSimulcastButtons(remoteFeed.rfindex, subStream, temporal);
            }
          } else {
            // What has just happened?
          }
        }
        if (jsep !== undefined && jsep !== null) {
          Janus.debug("Handling SDP as well...");
          Janus.debug(jsep);
          // Answer and attach
          remoteFeed.createAnswer(
            {
              jsep: jsep,
              // Add data:true here if you want to subscribe to datachannels as well
              // (obviously only works if the publisher offered them in the first place)
              media: {
                audioSend: false,
                videoSend: false
                //data: true
              }, // We want recvonly audio/video
              success: function(jsep) {
                Janus.debug("Got SDP!");
                Janus.debug(jsep);
                const body = {
                  "request": "start",
                  "room": config.room
                };
                if (config.token) body.token = config.token;
                remoteFeed.send({
                  "message": body,
                  "jsep": jsep
                });
              },
              error: function(error) {
                Janus.error("WebRTC error:", error);
                config.onError("WebRTC error", error);
              }
            });
        }
      },
      webrtcState: function(on) {
        Janus.log("Janus says this.WebRTC PeerConnection (feed #" + remoteFeed.rfindex + ") is " + (on ? "up" : "down") + " now");
      },
      onlocalstream: function(stream) {
        // The subscriber stream is recvonly, we don't expect anything here
      },
      ondataopen: function(label) {
        if (config.onDataOpen) {
          config.onDataOpen(remoteFeed, label);
        }
      },
      ondata: function(data) {
        if (data.length >= dataChunk) {
          dataBuffer = dataBuffer + data;
        } else {
          if (dataBuffer.length > 0) {
            dataBuffer = dataBuffer + data;
            try {
              data = JSON.parse(dataBuffer);
              config.onMessage(data);
              dataBuffer = "";
            } catch (err) {
              config.onMessage({
                error: `Failed to parse JSON : ${err}`
              });
            }
          } else {
            try {
              data = JSON.parse(data);
              config.onMessage(data);
            } catch (err) {
              config.onMessage({
                error: `Failed to parse JSON : ${err}`
              });
            }
          }
        }
      },
      onremotestream: function(stream) {
        console.log(">>>>>>>>>>>>>>>>> onremotestream", stream);
        Janus.debug("Remote feed #" + remoteFeed.rfindex);

        config.remotestreams[remoteFeed.rfindex] = {};
        config.remotestreams[remoteFeed.rfindex].index = remoteFeed.rfindex;
        config.remotestreams[remoteFeed.rfindex].feedId = remoteFeed.getId();
        config.remotestreams[remoteFeed.rfindex].stream = stream;
        config.remotestreams[remoteFeed.rfindex].feed = remoteFeed;
        config.onRemoteJoin(remoteFeed.rfindex, remoteFeed.rfdisplay, remoteFeed.getId());
        if (Janus.webRTCAdapter.browserDetails.browser === "chrome" || Janus.webRTCAdapter.browserDetails.browser === "firefox") {
          if (config.onVolumeMeterUpdate) {
            const ctx = new AudioContext();
            const meter = volumeMeter(ctx, {
              tweenIn: 2,
              tweenOut: 6,
              skip: config.volumeMeterSkip
            }, (volume) => {
              config.onVolumeMeterUpdate(remoteFeed.rfindex, volume);
            });
            const src = ctx.createMediaStreamSource(config.remotestreams[remoteFeed.rfindex].stream);
            src.connect(meter);
            config.remotestreams[remoteFeed.rfindex].stream.onended = meter.stop.bind(meter);
          }
        }
      },
      oncleanup: function() {
        Janus.log(" ::: Got a cleanup notification (remote feed " + id + ") :::");
        remoteFeed.simulcastStarted = false;
        /*
                if (remoteFeed.spinner !== undefined && remoteFeed.spinner !== null) {
                  remoteFeed.spinner.stop();
                }
                remoteFeed.spinner = null;
        */
        //delete (config.remotestreams[remoteFeed.rfindex]); //prevent delete data
        config.onRemoteUnjoin(remoteFeed.rfindex, remoteFeed.rfdisplay);
      }
    });
}

const doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true");

class JanusRoom {

  constructor(options) {
    // Make sure the entire configuration get flushed first
    config = {
      remotestreams: {},
      feeds: [],
      bitrateTimer: []
    };
    //window.remotestreams = config.remotestreams;
    // Assign the values
    config.getJanusServer = options.getJanusServer || Janus.noop();
    config.publishers = options.publishers || 8;
    config.rejoin = options.rejoin || Janus.noop();
    config.server = options.server || null;
    config.opaqueId = "room-" + Janus.randomString(12);
    config.room = options.room || null;
    config.publishOwnFeed = options.publishOwnFeed || false;
    config.extensionId = options.extensionId || null;
    config.token = options.token || null;
    config.useRecordPlugin = options.useRecordPlugin || false;
    config.volumeMeterSkip = options.volumeMeterSkip || 0;
    // Events
    config.onLocalJoin = options.onLocalJoin || null;
    config.onRemoteJoin = options.onRemoteJoin || null;
    config.onRemoteUnjoin = options.onRemoteUnjoin || null;
    config.onRecordedPlay = options.onRecordedPlay || null;
    config.onMessage = options.onMessage || null;
    config.onDestroyed = options.onDestroyed || null;
    config.onVolumeMeterUpdate = options.onVolumeMeterUpdate || null;
    config.onError = options.onError || null;
    config.onWarning = options.onWarning || null;
    config.iceServers = options.iceServers || [{
      urls: ["stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun3.l.google.com:19302"]
    }];
    config.onDataOpen = options.onDataOpen || null;
    config.onLocalDataOpen = options.onLocalDataOpen || null;
    config.connectionInit = options.connectionInit || Janus.noop();
    config.connectionLost = options.connectionLost || Janus.noop();
    config.connectionRestored = options.connectionRestored || Janus.noop();
  }

  init(callbacks) {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(">>>>>>>>>>>>>>>> INIT");
        if (!config.server) {
          const server = await config.getJanusServer();
          console.log(">>>>>>>>>>>>>>>> SERVER", server);
          if (!server) {
            reject("server value is needed.");
            return;
          }
          config.server = server;
        }
        Janus.init({
          debug: "all",
          callback: () => {
            start({
              connectionInit: () => {
                config.connectionInit();
              },
              connectionLost: () => {
                config.connectionLost();
              },
              connectionRestored: () => {
                this.reinit();
                config.connectionRestored();
              },
              resolve: () => {
                callbacks.success();
              }
            })
              .then(() => {
                resolve();
              })
              .catch((err) => {
                reject(err);
              });
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  reinit() {
    if (config.janus.isConnected()) {
      config.janus.destroy({
        success: () => {
          config.connectionLost();
          start({
            connectionInit: () => {
              config.connectionInit();
            },
            connectionLost: () => {
              config.connectionLost();
            },
            connectionRestored: () => {
              this.reinit();
              config.connectionRestored();
            },
            resolve: () => {
              console.log("----- RECONNECTED -----");
              alert("resolve");
              config.reinitHandler();
            }
          });
        },
        cleanupHandles: true
        //notifyDestroyed: true,
        //unload: true
      });
    } else {
      console.warn("NOT CONNECTED!");
    }
  }

  stop() {
    if (config.janus) {
      this.stopRecording();
      // Make sure the webcam and microphone got turned off first
      if (config.mystream) {
        const tracks = config.mystream.getTracks();
        for (const i in tracks) {
          if (tracks[i]) {
            tracks[i].stop();
          }
        }
      }
      config.janus.destroy();
    }
  }

  createRoomHandler(callbacks) {
    createRoomHandler(callbacks);
  }

  exists(options) {
    return new Promise((resolve, reject) => {
      try {
        const exists = {
          request: "exists",
          room: options.room
        };
        if (config.token) exists.token = config.token;
        config.videoRoomHandler.send({
            message: exists,
            success: function(data) {
              console.log("exists", data);
              resolve(data);
            },
            error: function(err) {
              console.error("exists", err);
              reject(err);
            }
          }
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  joinRoom(options) {
    return new Promise((resolve, reject) => {
      try {
        if (!options || (options && !options.profile.name)) {
          reject("username value is needed.");
          return;
        }
        if (!options || (options && !options.room)) {
          reject("room value is needed.");
          return;
        }
        config.profile = options.profile || config.profile;
        config.room = options.room || config.room;
        const register = {
          request: "join",
          ptype: "publisher",
          room: config.room,
          //id: config.profile.id, // TODO
          //profile: config.profile.id,
          display: config.profile.name
        };
        if (config.token) register.token = config.token;
        config.videoRoomHandler.send({
            message: register,
            success: function() {
              resolve();
            },
            error: function(err) {
              reject(err);
            }
          }
        );
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  leaveRoom(options) {
    return new Promise((resolve, reject) => {
      try {
        config.leaving = options.leaving || config.leaving;

        console.log(config.leave);

        const leave = {
          request: "leave"
        };
        config.videoRoomHandler.send({
            message: leave,
            success: function() {
              resolve();
            },
            error: function(err) {
              reject(err);
            }
          }
        );
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  toggleMuteAudio() {
    return new Promise((resolve, reject) => {
      try {
        const muted = config.videoRoomHandler.isAudioMuted();
        Janus.log((muted ? "Unmuting" : "Muting") + " local stream...");
        if (muted) {
          config.videoRoomHandler.unmuteAudio();
        } else {
          config.videoRoomHandler.muteAudio();
        }
        resolve(config.videoRoomHandler.isAudioMuted());
      } catch (err) {
        reject(err);
      }
    });
  }

  toggleMuteVideo() {
    return new Promise((resolve, reject) => {
      try {
        const muted = config.videoRoomHandler.isVideoMuted();
        Janus.log((muted ? "Unmuting" : "Muting") + " local stream...");
        if (muted) {
          config.videoRoomHandler.unmuteVideo();
        } else {
          config.videoRoomHandler.muteVideo();
        }
        resolve(config.videoRoomHandler.isVideoMuted());
      } catch (err) {
        reject(err);
      }
    });
  }

  /*
    toggleVideo() {
      return new Promise((resolve, reject) => {
        let videoStopped = false;
        let audioStopped = false;
        if (!config.mystream) {
          reject('No local stream.');
          return;
        } else {
          if (config.mystream.getVideoTracks().length > 0) {
            videoStopped = config.mystream.getVideoTracks()[0].readyState === 'ended';
          }
          if (config.mystream.getAudioTracks().length > 0) {
            audioStopped = config.mystream.getAudioTracks()[0].readyState === 'ended';
          }
        }
        if (!videoStopped) {
          config.mystream.getVideoTracks()[0].stop();
        }
        if (config.publishOwnFeed) {
          startOwnFeed({
            audioSend: !audioStopped,
            videoSend: videoStopped,
            replaceVideo: videoStopped,
            replaceAudio: audioStopped,
          }, () => {
            resolve(!videoStopped);
          });
        } else {
          resolve(!videoStopped);
        }
      });
    }
  */

  sendMessage(data) {
    return new Promise((resolve, reject) => {
      try {
        if (!config.videoRoomHandler.alive) {
          console.warn("videoRoomHandler sleep");
          return;
        }
        const text = JSON.stringify(data);
        for (let i = 0; i < text.length; i += dataChunk) {
          const substr = text.substring(i, i + dataChunk);
          config.videoRoomHandler.data({
            text: substr,
            //label: config.myid,
            success: function() {
              resolve();
            },
            error: function(err) {
              reject(err);
            }
          });
        }
        resolve();
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  attachStream(target, index) {
    return new Promise((resolve, reject) => {
      try {
        if (index === 0) {
          Janus.attachMediaStream(target, config.mystream);
        } else {
          Janus.attachMediaStream(target, config.remotestreams[index].stream);
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  isShareScreenStream(index) {
    return new Promise((resolve, reject) => {
      let res = false;
      let tracks;
      try {
        if (index === 0) {
          tracks = config.mystream.getVideoTracks();
        } else if (config.remotestreams[index].stream) {
          tracks = config.remotestreams[index].stream.getVideoTracks();
        }
        if (tracks && tracks[0] && tracks[0].label &&
          // Video tracks from webcam got labeled as "Integrated Camera" or "iSight"
          // TODO collect this label value from various browsers/devices
          (tracks[0].label.toLowerCase()
              .indexOf("monitor") > -1 || // Firefox, "Primary Monitor"
            tracks[0].label.toLowerCase()
              .indexOf("screen") > -1 || // Chrome, "screen:0:0"
            tracks[0].label.toLowerCase()
              .indexOf("window:") > -1 // Chrome, "window:37483", window capture
          )
        ) {
          res = true;
        }
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  }

  attachRecordedPlayStream(target) {
    return new Promise((resolve, reject) => {
      try {
        Janus.attachMediaStream(target, config.recordedplaystream);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  shareScreen() {
    return new Promise((resolve, reject) => {
      try {
        stopOwnFeed();
        setTimeout(() => {
          shareScreen((err) => {
            if (err) {
              reject(err);
              return;
            }
            resolve();
          });
        }, 500);
      } catch (err) {
        reject(err);
      }
    });
  }

  stopShareScreen() {
    return new Promise((resolve, reject) => {
      /*
      if (!config.publishOwnFeed) {
        return reject();
      }
      */
      try {
        stopOwnFeed();
        setTimeout(() => {
          startOwnFeed({
            audioSend: true
            /*
            replaceVideo: true,
            replaceAudio: true,
            */
          }, () => {
            resolve();
          });
        }, 1000);
      } catch (err) {
        reject(err);
      }
    });
  }

  startOwnFeed(opts, cb) {
    startOwnFeed(opts, cb);
  }

  stopOwnFeed() {
    return stopOwnFeed();
  }

  sendPing() {
    return new Promise((resolve, reject) => {
      try {
        config.videoRoomHandler.data({
          text: "ping",
          success: function() {
            resolve();
          },
          error: function(err) {
            reject(err);
          }
        });
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  }

  createRoom(options) {
    return new Promise((resolve, reject) => {
      try {
        options = options || {};
        config.room = options.room || null;
        // TODO handle room's secret
        const body = {
          request: "create",
          room: config.room,
          description: options.description,
          secret: options.secret,
          publishers: 20,
          //publishers: config.publishers,
          fir_freq: 2,
          //fir_freq: options.fir_freq,
          videocodec: "h264",
          audio_level_average: 75,
          bitrate: 150000
        };
        if (config.token) body.token = config.token;
        config.videoRoomHandler.send({
          "message": body
        });
        // TODO catch the response
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  removeRoom() {
    return new Promise((resolve, reject) => {
      try {
        // TODO handle room's secret
        const body = {
          "request": "destroy",
          "room": config.room
        };
        if (config.token) body.token = config.token;
        config.videoRoomHandler.send({
          "message": body
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  getRoomsList() {
    return new Promise((resolve, reject) => {
      const body = {
        "request": "list"
      };
      config.videoRoomHandler.send({
        "message": body,
        success: function(result) {
          resolve(result);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }

  getRoomParticipants(room) {
    return new Promise((resolve, reject) => {
      const body = {
        request: "listparticipants",
        room: room
      };
      config.videoRoomHandler.send({
        "message": body,
        success: function(result) {
          resolve(result);
        },
        error: function(err) {
          reject(err);
        }
      });
    });
  }

  stopPlayback() {
    return stopPlayback();
  }

  recordedPlayback(recordId) {
    return new Promise((resolve, reject) => {
      const play = {
        "request": "play",
        "id": parseInt(recordId, 10)
      };
      if (config.recordedplaystream) {
        const tracks = config.recordedplaystream.getTracks();
        for (const i in tracks) {
          if (tracks[i]) {
            tracks[i].stop();
          }
        }
        config.recordedplaystream = null;
        stopPlayback()
          .then(() => {
            config.recordPlayHandler.send({
              "message": play,
              success: function() {
                resolve();
              },
              error: function(err) {
                reject(err);
              }
            });
          })
          .catch((err) => {
            reject(err);
          });
      } else {
        config.recordPlayHandler.send({
          "message": play,
          success: function() {
            resolve();
          },
          error: function(err) {
            reject(err);
          }
        });
      }
    });
  }

  startRecording(options) {
    return startRecording(options);
  }

  stopRecording() {
    return new Promise((resolve, reject) => {
      if (config.recordPlayHandler) {
        const stop = {
          "request": "stop"
        };
        config.recordPlayHandler.send({
          "message": stop,
          success: function() {
            resolve();
          },
          error: function(err) {
            reject(err);
          }
        });
      }
    });
  }

  getStream(streamIndex) {
    console.log(config.remotestreams);
    return new Promise((resolve, reject) => {
      try {
        if ("" + streamIndex === "0") {
          resolve(config.mystream);
        } else {
          if (config.remotestreams[streamIndex]) {
            resolve(config.remotestreams[streamIndex].stream);
          } else {
            reject(new Error("No such stream index: " + streamIndex));
          }
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  getStreamBitrate(streamIndex) {
    return new Promise((resolve, reject) => {
      try {
        if (config.remotestreams[streamIndex] && config.remotestreams[streamIndex].feed && "" + streamIndex !== "0") {
          resolve(config.remotestreams[streamIndex].feed.getBitrate());
        } else if (config.videoRoomHandler && "" + streamIndex === "0") {
          resolve(config.videoRoomHandler.alive);
        } else {
          reject(new Error("No such stream index: " + streamIndex));
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  getConfig() {
    return config;
  }

  configure(opts) {
    return new Promise((resolve, reject) => {
      try {
        const configure = {
          request: "configure",
          video: opts.sendVideo,
          audio: opts.sendAudio
        };
        if (config.token) {
          configure.token = config.token;
        }
        console.log(configure);
        config.videoRoomHandler.send({
          message: configure
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default JanusRoom;
