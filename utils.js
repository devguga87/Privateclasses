module.exports = {
  age(timestamp) {
    const today = new Date();
    const birthDate = new Date(timestamp);

    let age = today.getFullYear() - birthDate.getFullYear();

    const month = today.getMonth() - birthDate.getMonth();
    if ((month < 0 || month == 0) && today.getDate() - birthDate.getDate()) {
      age -= 1;
    }
    return age;
  },
  graduation(value) {
    if (value == 'medio') {
      return 'Ensino medio';
    } if (value == 'superior') {
      return 'Ensino superior';
    } if (value == 'doutor') {
      return 'Doutourado';
    } if (value == 'mestre') {
      return 'Mestrado';
    }
  },
  date(timestamp) {
    const date = new Date(timestamp);
    // yyyy
    const year = date.getUTCFullYear();

    // mm
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);

    // dd
    const day = `0${date.getUTCDate()}`.slice(-2);

    // return yyyy-mm-dd
    return `${year}-${month}-${day}`;
  },
};
