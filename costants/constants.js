module.exports.ErrCodeServer = 500;
module.exports.OkCodeCreated = 201;

module.exports.linkRegex = /^(http:\/\/|https:\/\/|\www.){1}([0-9A-Za-z\-._~:/?#[\]@!$&'()*+,;=]+\.)([A-Za-z]){2,3}(\/)?/;

module.exports.BadDataErrMessage = 'Ошибка. Данные не корректны';
module.exports.NotFoundErrMessage = 'Ошибка. Пользователь или фильм не найден';
module.exports.UnauthorizationErrMessage = 'Ошибка. Неправильные почта или пароль';
module.exports.ConflictEmailErrMessage = 'Ошибка. Пользователь с таким email уже зарегистрирован';
module.exports.ForbiddenErrMessage = 'Ошибка. Нельзя удалить чужой фильм';
module.exports.ErrCodeServerMessage = 'На сервере произошла ошибка';
