// required 
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

// express server
const app = express();
const PORT = process.env.PORT || 3000;

//set template
app.set("view engine", "ejs");
app.use(express.static("public"));

// need parse html data for POST request
app.use(express.urlencoded({
    extended:true
}))
app.use(express.json());

app.get('/', (req,res)=>{
    res.render("index");
})

app.post('/convert-mp3', async (req,res) =>{

    videoID = req.body.videoID;

    if(videoID === undefined ||
        videoID === '' ||
        videoID === null){
            return res.render('index', {success:false, message:"Please enter a video ID or a video URL."});
        }else{
            function testURLbyRegex(el){ // #2
                //  https://www.youtube.com/watch?v=04854XqcfCY&ab_channel=QueenOfficial
                if(el.match(/=(.*?)&/g)){
                    console.log(`${el} est valide! `);
                    //console.log( el.match(/=(.*?)&/g));
                    let result = el.match(/=(.*?)&/g);
                    result=result.join();
                    //const newregex =/(?!=).*(?<!&)/;
                    videoID0=result.match(/(?!=).*(?<!&)/);
                    //console.log('new', videoID0);
                    videoID = videoID0;
                }else{ // 04854XqcfCY
                    videoID=el;
                }                
                return videoID;

            }
            testURLbyRegex(videoID)

            const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`,{
                "method" : "GET",
                "headers":{
                    "x-rapidapi-key" : process.env.API_KEY,
                    "x-rapidapi-host" : process.env.API_HOST,
                }            
            });

            const fetchResponse = await fetchAPI.json();
            if(fetchResponse.status === "ok"){
                return res.render("index", { success:true, song_title: fetchResponse.title, song_link : fetchResponse.link});

            }else{
                return res.render("index", {success:false, message: fetchResponse.msg})
            }
        }
})



// start
app.listen(PORT, () =>{
    console.log(`Server started on port http://localhost:${PORT}`);
})