const content_dir = "https://aulerius.art/everyperson/";
const objkt_adress = "https://objkt.com/asset/KT1XAfXQ9Q8GKTeNVb8d3dgLtrom7vuYU2iF/"; //leads to person token by id
const versum_adress = "https://versum.xyz/token/versum/"; //leads to curious-about token by ITEM id

const person_container = document.getElementById("person_container");
person_container.dataset.queue_pos = "veik blet"
const person_info = document.getElementById("person_info");
const person_display = document.getElementById("person_display_template");
const curious_info = document.getElementById("curious_info");
const curious_display = document.getElementById("curious_display_template");
const curious_text = document.getElementById("curious_text");
const curious_aspect_ratio = 1.5625;
const modal_element = document.getElementById("info_modal");

const about_button = document.getElementById("about");
const iamcurious_button = document.getElementById("i_am_curious");
const curiosity_button = document.getElementById("curiosity_queue");

const about_info = document.getElementById("about_info");
const curious_about_info = document.getElementById("curious_about_info");
const curiosity_info = document.getElementById("curiosity_info");
const bottom_panel = document.getElementById("bottom_panel");
const queue_text = document.getElementById("queue_text");

let person_opened = null;
let opened_modal = null;
let person_side = "left"; //either left or right
let persons = []; //array of objects containing all metadata for each person
let requests_amount = 0;



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
	
	fetch(content_dir + "curiosity_data.json")
	.then(response => response.json())
	.then(json => {
	process_curiosity_data(json.requests);
	}).catch(err => console.log(err));
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
  if (event.target == modal_element || event.target.classList.contains("exit")) {
	if(opened_modal != null){
		modal_element.style.display = "none";
		opened_modal.classList.remove("modal_content_selected")
		opened_modal = null;
	}
	curiosity_close();
  }
}
//open curiosity queue popup panel, fade persons
curiosity_button.onclick = function(event) {
	bottom_panel.style.display = "revert";
	person_container.style.setProperty("--queue-filter", "block");
	Array.from(person_container.querySelectorAll(".person:not(.in_queue)")).forEach((elem) => {
        elem.classList.add("faded");
	});
	queue_text.innerHTML = format_queue_text(requests_amount);
	
}
//close popup panel, unfade
function curiosity_close(){
	bottom_panel.style.display = "none";
	person_container.style.setProperty("--queue-filter", "none");
	Array.from(person_container.querySelectorAll(".faded")).forEach((elem) => {
        elem.classList.remove("faded");
	});
}


function setup_persons(persons){
  let per_cont; let id; let per; let curious_cont; let curious; let additional;
  for (y = 0; y < persons.length; y++) {
      //creating containers for each person, assigning imgs
      per_cont = document.createElement("div");
	  per_cont.classList.add("person");
	  per = person_display.cloneNode(true);
      per.removeAttribute("id");
	  per_cont.appendChild(per);
	  //per.style.backgroundImage = "url(lighter-load/persons/" + persons[y].filename + ".jpg)";
      //per.src = content_dir + "persons/" + persons[y].filename + ".gif";
	  per.querySelector(".person_img").src = content_dir + "persons/" + persons[y].filename + ".gif";
	  per.querySelector(".person_lighter_img").src = content_dir + "lighter-load/persons/" + persons[y].filename + ".jpg";
      id = y;
      per_cont.id = "person_"+id;
      //per.id = id + "_person_display"
      randomize_look(per);
      person_container.appendChild(per_cont);
	  
	  
      
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
		curiosity_close();
        clicked_cont = event.target.closest(".person");
        person_data = persons[parseInt(clicked_cont.id.slice(7))];
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
          person_info.querySelector("#person_info .person_info_top a").href = objkt_adress + person_data.token_id;
          
		  //assigning correct curious text
		  curious_text.innerHTML = format_curious_text(person_data);
		  
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
      id = parseInt(person_opened.id.slice(7));
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

function date_sort(a, b) {
    return new Date(a.request_date).getTime() - new Date(b.request_date).getTime();
}
function process_curiosity_data(data){
	//status: "held-valid" "fulfiled" "transfered-invalid"
	data.sort(date_sort);
	for (y = 0; y < data.length; y++) {
		id_match = persons.findIndex(x => x.token_id == data[y].token_id);
		if(data[y].status != "transfered-invalid"){
			temp = Object.assign(persons[id_match], data[y]);
			persons[id_match] = temp;
			if(persons[id_match].curious_about_token_id == undefined){
				requests_amount += 1;
				per = document.getElementById('person_'+id_match);
				per.classList.add("in_queue");
				//also append request data to global persons object array
				per.dataset.queue_pos = requests_amount;
			}
			//console.log(JSON.stringify(persons[id_match]));
		}
	}
		
}

function format_queue_text(amount){
	if(amount==0){
		return "thare are currenty no persons in the queue of curiosity";
	}
	else if(amount==1){
		return "there is currenty 1 person in the queue of curiosity";
	}
	else{
		return "there are currenty " + amount + " persons in the queue of curiosity";
	}
}

function format_curious_text(data){
	console.log(data);
	if(data.curious_about_token_id!=undefined){
		if (data.requestor != "SELF"){
			return data.requestor + " was curious about this person:";
		}
		else {
			return "being curious about this person:";
		}
	}
	else if(data.status != undefined){
		date = new Date(data.request_date);
		return data.requestor + " has been curious about this person since " + date.toLocaleDateString();
	}
	else{	
		return "nobody has been curious about this person yet...";
	}
}
	