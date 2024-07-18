const handleApiError = (error, setErr, context) => {
  if (error.response) {
    console.error(
      `Server responded with status code ${error.response.status}:`,
      error.response.data
    );
    setErr({ status: error.response.status, msg: error.response.data.msg });
  } else if (error.request) {
    console.error("No response received:", error.request);
    setErr({ msg: "No response received" });
  } else {
    console.error("Error in request setup:", error.message);
    setErr({ msg: error.message });
  }
  throw new Error(`API request failed in ${context}: ${error.message}`);
};

export default handleApiError;
