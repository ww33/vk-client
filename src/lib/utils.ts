import dayjs from "dayjs";

export const getDayAsString = ((number: number = 0) => {
  // if (number === 0) {
  //   return '20-04-04'
  // } else if (number === -1) {
  //   return '20-04-03'
  // }

  if (number === 0) {
    return dayjs().format("YY-MM-DD");
  } else if (number === -1) {
    return dayjs().add(-1, "day").format("YY-MM-DD");
  }

});

export const detectIsMobile = () => {
  let isMobile = false; //initiate as false
// device detection
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
    isMobile = true;
  }

  return isMobile;
};

export const getPrintableName = (profile: any) => {
  if (profile) {
    if (profile.first_name) {
      return profile.first_name;
    } else if (profile.nickname) {
      return profile.nickname;
    }
    console.warn("error parse profile", profile);
  }
};

export const getPrintableNameFull = (profile: any) => {
  if (profile) {
    if (profile.first_name) {
      return !profile.lastName ? profile.first_name : profile.first_name + "&nbsp;" + profile.lastName;
    } else if (profile.nickname) {
      return profile.nickname;
    }
    console.warn("error parse profile", profile);
  }
};

export const zodiacSigns = {
  "aries": "Овен",
  "taurus": "Телец",
  "gemini": "Близнецы",
  "cancer": "Рак",
  "leo": "Лев",
  "virgo": "Девы",
  "libra": "Весы",
  "scorpio": "Скорпион",
  "sagittarius": "Стрелец",
  "capricorn": "Козерог",
  "aquarius": "Водолей",
  "pisces": "Рыбы",
};

export const zodiacSignsCounter = {
  "Овен": 0,
  "Телец": 0,
  "Близнецы": 0,
  "Рак": 0,
  "Лев": 0,
  "Девы": 0,
  "Весы": 0,
  "Скорпион": 0,
  "Стрелец": 0,
  "Козерог": 0,
  "Водолей": 0,
  "Рыбы": 0,
  "All": 0,
};

export const getAgeAndZodiac = (dateString: string) => {
  const result = {error: null, age: 0, zodiac: ""};
  let birthDate;
  let birthDateFullYear: number, birthDateMonth: number, birthDateDay: number;

  try {
    const arr = dateString.split(".");
    if (arr.length == 3) {
      birthDateDay = parseInt(arr[0]);
      birthDateMonth = parseInt(arr[1]);
      birthDateFullYear = parseInt(arr[2]);
    } else {
      result.error = {msg: "wrong date", dateString};
      return result;
    }
    /*    birthDate = new Date(dateString);
        birthDateFullYear = birthDate.getFullYear()
        birthDateMonth = birthDate.getMonth()
        birthDateDay = birthDate.getDay()*/

    birthDate = new Date(birthDateFullYear, birthDateMonth - 1, birthDateDay);
    if (birthDateFullYear < 1910
      || birthDateFullYear > 2030
      || birthDateDay < 1
      || birthDateDay > 31
      || birthDateMonth < 1
      || birthDateMonth > 12
    ) {
      result.error = {msg: "wrong date", dateString};
      return result;
    }
  } catch (e) {
    result.error = {msg: "wrong date", dateString, e};
    return result;
  }

  const today = new Date();
  result.age = today.getFullYear() - birthDateFullYear;
  const m = today.getMonth() - birthDateMonth;
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    result.age--;
  }

  try {
    result.zodiac = getZodiacSign(birthDateDay, birthDateMonth);
  } catch (e) {
    result.zodiac = null;
  }

  return result;
};

export const getZodiacSign = (day: number, month: number) => {

  //const zodiacSigns = this.zodiacSigns

  if ((month == 1 && day <= 20) || (month == 12 && day >= 22)) {
    return zodiacSigns.capricorn;
  } else if ((month == 1 && day >= 21) || (month == 2 && day <= 18)) {
    return zodiacSigns.aquarius;
  } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
    return zodiacSigns.pisces;
  } else if ((month == 3 && day >= 21) || (month == 4 && day <= 20)) {
    return zodiacSigns.aries;
  } else if ((month == 4 && day >= 21) || (month == 5 && day <= 20)) {
    return zodiacSigns.taurus;
  } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
    return zodiacSigns.gemini;
  } else if ((month == 6 && day >= 22) || (month == 7 && day <= 22)) {
    return zodiacSigns.cancer;
  } else if ((month == 7 && day >= 23) || (month == 8 && day <= 23)) {
    return zodiacSigns.leo;
  } else if ((month == 8 && day >= 24) || (month == 9 && day <= 23)) {
    return zodiacSigns.virgo;
  } else if ((month == 9 && day >= 24) || (month == 10 && day <= 23)) {
    return zodiacSigns.libra;
  } else if ((month == 10 && day >= 24) || (month == 11 && day <= 22)) {
    return zodiacSigns.scorpio;
  } else if ((month == 11 && day >= 23) || (month == 12 && day <= 21)) {
    return zodiacSigns.sagittarius;
  }
};

export const roundDecimals = (num, decimals = 1) => {

  let val = parseFloat(num);
  //Format the value w/ the specified number
  //of decimal places and return it.
  return val.toFixed(decimals);
  //@ts-ignore
  // return +(Math.round(num + "e+2")  + "e-2");
};
