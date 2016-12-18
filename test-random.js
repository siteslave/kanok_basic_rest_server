let _ = require('lodash');

let sampleWords = 'ค่ะ1 ค่ะ2ค่ะ1 ค่ะ2ค่ะ 1ค่ะ2ค่ะ 1ค่ะ2 รถปกดหกม หด่หกรถหกดหส';

let myWords = [
  { name: 'txt1', keywords: ['ค่ะ', 'ครับ', 'ผม', 'ดิฉัน'] },
  { name: 'txt2', keywords: ['รถยนต์', 'รถเก๋ง', 'รถมอเตอร์ไซต์'] }
];

let textResults = [];

let splitsTexts = sampleWords.split(' ');
splitsTexts.forEach(v => {
  let words = _.find(myWords, { name: 'txt1' });
  let words2 = _.find(myWords, { name: 'txt2' });

  let replaceText = _.sample(words.keywords);
  let replaceText2 = _.sample(words2.keywords);

  let _idx = v.indexOf('ค่ะ');
  let _idx2 = v.indexOf('รถ');
  let newText = null;
  
  if (_idx > -1) {
    newText = v.replace('ค่ะ', replaceText)
  }
  if (_idx2 > -1) {
    if (newText) newText.replace('รถ', replaceText2);
    else newText = v.replace('รถ', replaceText2);
  }
    
  // let newText = v.replace('ค่ะ', replaceText).replace('รถ', replaceText2);
  textResults.push(newText);
});
console.log(sampleWords);
console.log(textResults.join(' '));
