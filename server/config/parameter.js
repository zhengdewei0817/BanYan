// 需要替换掉的参数
// id=1<script></script> => id=1
const NUMBER_REG = /(\D).*/g;

exports.id = NUMBER_REG;