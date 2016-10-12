export function createMessage(user, text) {
  const temporaryId = randomId()
  return {
    sending: true,
    failed: false,
    id: `send-${temporaryId}`,
    text,
    sent: 'sending...',
    fromUser: user
  }
}

export function createStatusMessage(user, text) {
  const temporaryId = randomId()
  return {
    sending: true,
    failed: false,
    id: `send-${temporaryId}`,
    text,
    status: true,
    sent: 'sending...',
    fromUser: user
  }
}

// https://gist.github.com/jed/982883
function randomId(
  a                  // placeholder
) {
  return a           // if the placeholder was passed, return
    ? (              // a random number from 0 to 15
      (// unless b is 8,
      (a ^ Math.random()  // in which case
      * 16           // a random number from
      >> a / 4))         // 8 to 11
      ).toString(16) // in hexadecimal
    : (              // or otherwise a concatenated string:
      (// -80000000 +
      ([1e7] +        // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 + -1e11))          // -100000000000,
      ).replace(     // replacing
        /[018]/g,    // zeroes, ones, and eights with
        randomId            // random hex digits
      )
}
