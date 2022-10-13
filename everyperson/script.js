const content_dir = "https://aulerius.art/everyperson/";
const objkt_adress = "https://objkt.com/asset/KT1XAfXQ9Q8GKTeNVb8d3dgLtrom7vuYU2iF/"; //leads to person token by id
const versum_adress = "https://versum.xyz/token/versum/"; //leads to curious-about token by ITEM id

const person_container = document.getElementById("person_container");
const person_info = document.getElementById("person_info");
const curious_info = document.getElementById("curious_info");
const curious_display = document.getElementById("curious_display_template");
const curious_aspect_ratio = 1.5625;
const modal_element = document.getElementById("info_modal");

const about_button = document.getElementById("about");
const iamcurious_button = document.getElementById("i_am_curious");

const about_info = document.getElementById("about_info");
const curious_about_info = document.getElementById("curious_about_info");

let person_opened = null;
var opened_modal = null;
let person_side = "left"; //either left or right
let persons = [];

//retrieving data about persons that lets it build person elements and set size for container
fetch(content_dir + "person_data.json")
  .then(response => response.json())
  .then(json => {
    persons = json.persons;
    shuffle(persons);
    setup_persons(persons);
    var total_height = calculate_height(persons);
    person_container.style.setProperty("--elem-taller-ratio", 1+curious_aspect_ratio);
    person_container.style.setProperty("--persons-total-height", total_height*1.1+2);
    setup_person_events(person_container);
    setup_person_info_events(person_info);
  })
  .catch(err => console.log(err));

//open modal on questionmark click
about_button.addEventListener("click", function(){
  modal_element.style.display = "block";
  opened_modal = about_info;
  opened_modal.classList.add("modal_content_selected");
});
//open modal on curiousabout click
iamcurious_button.addEventListener("click", function(){
  modal_element.style.display = "block";
  opened_modal = curious_about_info;
  opened_modal.classList.add("modal_content_selected");
});
//close when clicked anywhere outside or on X exit button
window.onclick = function(event) {
  console.log(String(event.target));
  if (event.target == modal_element || event.target.classList.contains("modal_exit")) {
    modal_element.style.display = "none";
    opened_modal.classList.remove("modal_content_selected")
    opened_modal = null;
  }
} 

function setup_persons(persons){
  let per_cont; let id; let per; let curious_cont; let curious; let additional;
  for (y = 0; y < persons.length; y++) {
      //creating containers for each person, assigning imgs
      per_cont = document.createElement("div");
      per = document.createElement("img");
      per.src = content_dir + "persons/" + persons[y].filename;
      per_cont.classList.add("person");
      per.classList.add("person_img");
      id = y;
      per_cont.id = id;
      per.id = id + "_img"
      randomize_look(per);
      person_container.appendChild(per_cont);
      per_cont.appendChild(per);
      
      //adding container to hold all info seen after opening and "curious about" element
      additional = document.createElement("div");
      additional.classList.add("person_additional");
      per_cont.appendChild(additional)
      
      //adding "curious about" image or placehoder of it
      curious_cont = document.createElement("div");
      curious_cont.classList.add("curious");
      additional.appendChild(curious_cont);
      curious = curious_display.cloneNode(true);
      curious.removeAttribute("id");
      curious_cont.appendChild(curious);
    
      if (persons[y].curious_about_filename!=undefined){
        curious.querySelector(".curious_img").src = content_dir + "lighter-load/curious-about/" + persons[y].curious_about_filename;
        per_cont.style.height ="var(--elem-taller-height)";
        curious_cont.classList.add("curious_exists");
      }
  }
}

function shuffle(array){
  for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function randomize_look(dom){
  //add randomized transforms and shadows
  dom.style.boxShadow = 
    (Math.random()-0.5)*0.3 + "rem " +
    Math.random()*0.35 + "rem " +
    0.5 + "rem " + 
    "rgba(0, 0, 0, 0.2)";
  dom.style.transform = "rotate(" + (Math.random()-0.5)*6 + "deg)";
  dom.style.zIndex = Math.floor(Math.random()*50 + 2);
}

function calculate_height(persons){
  //estimates total height that"s just enough to fit all persons
  let p_amount = persons.length;
  let c_amount = 0;
  for (const person of persons){
    if(person.curious_about_filename!=undefined){c_amount++}
  }
  return (p_amount + c_amount * curious_aspect_ratio);
}

function assign_side(element,context){
  return (element.getBoundingClientRect().x > context.innerWidth/2.1 ? "right" : "left");
}

function setup_person_events(parent_container){
    parent_container.addEventListener("click", event => {
      if(event.target.closest(".person")!=null){
        clicked_cont = event.target.closest(".person");
        person_data = persons[parseInt(clicked_cont.id)];
        additional_cont = clicked_cont.querySelector(".person_additional")
        curious_cont = clicked_cont.querySelector(".curious")
        if(person_opened==null){
          //hiding everything else
          Array.from(document.querySelector("#person_container").children).forEach((elem) => {
            elem.classList.add("hidden");
          });
          Array.from(document.querySelectorAll(".body_misc")).forEach((elem) => {
            elem.classList.add("hidden");
          });
          clicked_cont.classList.add("person_selected");

          //inserting person info element
          additional_cont.prepend(person_info);

          //assigning appropiate styles and info to info element
          person_side = (clicked_cont.getBoundingClientRect().x > window.innerWidth/2.1) ? "right" : "left";
          person_info.className = "";
          person_info.classList.add("person_info_" + person_side);
          clicked_cont.classList.add("person_" + person_side);
          person_info.querySelector(".person_text").innerHTML = person_data.person_text;
          person_info.querySelector("#person_info .person_info_top a").href = objkt_adress + persons[parseInt(clicked_cont.id)].token_id;
          
          //inserting curious info element, loading hq image
          curious_cont.prepend(curious_info)
          if (person_data.curious_about_filename!=undefined){
            curious_cont.querySelector(".curious_img").src = content_dir + "curious-about/" +  person_data.curious_about_filename;
            curious_cont.querySelector(".link_button a").href = versum_adress + person_data.curious_about_token_id;
          }
          person_opened = clicked_cont;
        }
      }
    });
}

function setup_person_info_events(info){
  info.addEventListener("click", event => {
    if(event.target.className.includes("person_exit")){
      //upon exiting opened person view reset state of all persons, removes added classes
      person_opened.classList.remove("person_selected");
      person_opened.classList.remove("person_right");
      person_opened.classList.remove("person_left");
      Array.from(document.querySelectorAll(".hidden")).forEach((elem) => {
        elem.classList.remove("hidden");
      });
      event.stopPropagation();
      
      //reset curious-about image to lighter-load version
      id = parseInt(person_opened.id);
      if (person_data.curious_about_filename!=undefined){
        person_opened.querySelector(".curious_img").src = content_dir + "lighter-load/curious-about/" + persons[id].curious_about_filename;
      }
      
      person_opened = null;
    };
    
    if(event.target.className.includes("i_am_curious")){
      //pop up modal for i-am-curious menu
    }
    
  });
}

