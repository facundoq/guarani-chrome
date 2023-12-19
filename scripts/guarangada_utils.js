class CSVParseError extends Error {
    constructor(message) {
      super(message);
      this.name = 'CSVParseError';
    }
  }