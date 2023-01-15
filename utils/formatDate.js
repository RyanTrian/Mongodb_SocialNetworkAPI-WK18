function formatDate (timestamp) {
	var date = new Date(timestamp);

	var months = ['January', 'February', 'March', 'April', 'May', 'June',
   'July', 'August', 'September', 'October',	'November', 'December'];

	return months[date.getMonth()] + ' ' + 
  date.getDate() + ', ' + date.getFullYear();
};

module.exports = { formatDate };