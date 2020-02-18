module.exports.handler = async (event, context) => {

  console.info("EVENT\n" + JSON.stringify(event, null, 2))

  return {
    statusCode: 200,
    body: `validated request received`
  }
}
