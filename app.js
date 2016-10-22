var request = require('request'),
fs = require('fs'),
cheerio = require('cheerio'),
data = [];
request('http://library.itats.ac.id/index.php?search=search', function (error, response, html) {
  if (!error && response.statusCode == 200) {
      //if using form with method get
      // request.get({
      //   url : 'http://library.itats.ac.id/index.php',
      //   qs: {
      //     'search': 'search',
      //     'keywords' : 'optimasi'
      //   },
      // } , function(err, res, body) {
      //     run(body);
      // });

      run(html);
  }
});

function run(e){
  var $ = cheerio.load(e);
  var length = $('.item').length;
  for(var i =0;i < length;i++){
    var judul = $($($('.item')[i]).find('a')[0]).html();
    var pengarang = $($($('.item')[0]).find('div.author')[0]).text().split(':')[1];
    data.push({
            title: judul,
            author: pengarang
        });
  }
  if($($('.next_link')[0]).attr('href')){
    console.info($($('.next_link')[0]).attr('href'));
    next($($('.next_link')[0]).attr('href'));
  }else{
    fs.writeFile("data.txt", JSON.stringify(data,null,2), function(err) {
    if(err) {
        return console.log(err);
    }
      console.log("The file was saved!");
    });
  }
}

function next(e){
  request('http://library.itats.ac.id'+e, function (error, response, html) {
    if (!error && response.statusCode == 200) {
        run(html);
    }
  });
}
