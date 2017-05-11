///<reference path="jquery-2.1.0-vsdoc.js"/>

var ContractsArray = [
    { 'value': '0', 'name': 'Tillsvidare' },
    { 'value': '1', 'name': 'Tidsbegränsad' },
    { 'value': '2', 'name': 'Projektanställning' },
    { 'value': '3', 'name': 'Fast anställning' },
    { 'value': '4', 'name': 'Övrig' },
];

var subjectsArray = [
    "ATV- och MC-teknik"

    ,
    "Administration"

    ,
    "Affärskommunikation"

    ,
    "Aktiviteter och värdskap"

    ,
    "Animation"

    ,
    "Anläggning"

    ,
    "Anläggningsförare"

    ,
    "Arkitektur"

    ,
    "Automationsteknik"

    ,
    "Automatiserade system"

    ,
    "Bageri- och konditorikunskap"

    ,
    "Beläggning"

    ,
    "Berghantering"

    ,
    "Betong"

    ,
    "Bild"

    ,
    "Bildteori"

    ,
    "Biodling"

    ,
    "Biologi"

    ,
    "Biologi i vattenmiljöer"

    ,
    "Biologi – naturbruk"

    ,
    "Brand, bevakning och säkerhet"

    ,
    "Bygg och anläggning"

    ,
    "Byggproduktionsledning"

    ,
    "Båtkunskap"

    ,
    "Cad"

    ,
    "Charkuterikunskap"

    ,
    "Cirkus"

    ,
    "Dansgestaltning"

    ,
    "Dansgestaltning för yrkesdansare"

    ,
    "Dansorientering"

    ,
    "Dansteknik"

    ,
    "Dansteknik för yrkesdansare"

    ,
    "Dansteori"

    ,
    "Datalagring"

    ,
    "Dator- och kommunikationsteknik"

    ,
    "Datoriserad mönsterhantering"

    ,
    "Datorstyrd produktion"

    ,
    "Design"

    ,
    "Digitalt skapande"

    ,
    "Djur"

    ,
    "Djurvård inom djurens hälso- och sjukvård"

    ,
    "Driftsäkerhet och underhåll"

    ,
    "Dryckeskunskap"

    ,
    "Däckstjänst"

    ,
    "El- och verkstadsteknik"

    ,
    "Eldistributionsteknik"

    ,
    "Elektronik"

    ,
    "Elektronikproduktion"

    ,
    "Elektroniksystem"

    ,
    "Elektroniksystem – installation och underhåll"

    ,
    "Elektroteknik"

    ,
    "Elementmontering"

    ,
    "Ellära"

    ,
    "Elmotordrivsystem"

    ,
    "Elmätteknik"

    ,
    "Elprojektering"

    ,
    "Energiteknik"

    ,
    "Engelska"

    ,
    "Engelska för döva"

    ,
    "Entreprenörskap"

    ,
    "Estetisk kommunikation"

    ,
    "Eurytmi"

    ,
    "Eventteknik"

    ,
    "Fartygsteknik"

    ,
    "Fastighetsautomation"

    ,
    "Fastighetsförvaltning"

    ,
    "Fastighetsservice"

    ,
    "Film- och tv-produktion"

    ,
    "Filosofi"

    ,
    "Fiske"

    ,
    "Fiskevård"

    ,
    "Flygplatsteknik"

    ,
    "Flygyrkesteknik"

    ,
    "Fordon och redskap inom naturbruk"

    ,
    "Fordons- och transportbranschen"

    ,
    "Fordonsteknik"

    ,
    "Fordonstestteknik"

    ,
    "Formgivning"

    ,
    "Fotografisk bild"

    ,
    "Fritids- och friskvårdsverksamheter"

    ,
    "Fritids- och idrottskunskap"

    ,
    "Fritidsbåtteknik"

    ,
    "Fysik"

    ,
    "Företagsekonomi"

    ,
    "Försäljning och kundservice"

    ,
    "Geografi"

    ,
    "Gerontologi och geriatrik"

    ,
    "Godshantering"

    ,
    "Godstransporter"

    ,
    "Golvläggning"

    ,
    "Grafisk kommunikation"

    ,
    "Grafisk produktion"

    ,
    "Grundläggande vård och omsorg"

    ,
    "Gränssnittsdesign"

    ,
    "Gymnasieingenjören i praktiken"

    ,
    "Handel"

    ,
    "Hantverk"

    ,
    "Hantverkskunskap"

    ,
    "Hippologi"

    ,
    "Historia"

    ,
    "Hjulutrustningsteknik"

    ,
    "Hotell"

    ,
    "Humanistisk och samhällsvetenskaplig specialisering"

    ,
    "Humanistisk och samhällsvetenskaplig spets.."

    ,
    "Hundkunskap"

    ,
    "Husbyggnad"

    ,
    "Husbyggnad – specialyrken"

    ,
    "Hygienkunskap"

    ,
    "Hälsa"

    ,
    "Hälsovård"

    ,
    "Hästkunskap"

    ,
    "Hållbart samhälle"

    ,
    "Idrott och hälsa"

    ,
    "Industriautomation"

    ,
    "Industrirör svets VVS"

    ,
    "Industrirörteknik"

    ,
    "Industriteknisk fördjupning"

    ,
    "Industritekniska processer"

    ,
    "Information och kommunikation"

    ,
    "Informationsteknisk arkitektur och infrastruktur"

    ,
    "Inköp och logistik"

    ,
    "Installationsteknik"

    ,
    "Installationsteknik VVS"

    ,
    "It i vård och omsorg"

    ,
    "Juridik"

    ,
    "Järnvägsbyggnad"

    ,
    "Järnvägsteknik"

    ,
    "Karosseriteknik"

    ,
    "Kemi"

    ,
    "Klassisk grekiska – språk och kultur"

    ,
    "Konferens och evenemang"

    ,
    "Konst och kultur"

    ,
    "Konsthantverk"

    ,
    "Konstruktion"

    ,
    "Kraft- och värmeteknik"

    ,
    "Kyl- och värmepumpsteknik"

    ,
    "Lackeringsteknik"

    ,
    "Lager och terminal"

    ,
    "Lantbruksdjur"

    ,
    "Lantbruksmaskiner"

    ,
    "Larm och säkerhetsteknik"

    ,
    "Lastmaskiner och truckar inom naturbruk"

    ,
    "Latin – språk och kultur"

    ,
    "Ledarskap och organisation"

    ,
    "Livsmedels- och näringskunskap"

    ,
    "Ljudproduktion"

    ,
    "Manuell mönsterkonstruktion"

    ,
    "Marin el och elektronik"

    ,
    "Marina elektroniksystem"

    ,
    "Marinmotorteknik"

    ,
    "Maskin- och lastbilsteknik"

    ,
    "Maskintjänst"

    ,
    "Massage"

    ,
    "Mat och butik"

    ,
    "Mat och dryck i kombination"

    ,
    "Matematik"

    ,
    "Materialkunskap"

    ,
    "Matlagningskunskap"

    ,
    "Medicin"

    ,
    "Medicinsk teknik"

    ,
    "Mediekommunikation"

    ,
    "Medieproduktion"

    ,
    "Medier, samhälle och kommunikation"

    ,
    "Mekatronik"

    ,
    "Mjukvarudesign"

    ,
    "Mobila arbetsmaskiner"

    ,
    "Moderna språk"

    ,
    "Modersmål"

    ,
    "Motor- och röjmotorsåg"

    ,
    "Mur- och putsverk"

    ,
    "Musik"

    ,
    "Musikteori"

    ,
    "Människan"

    ,
    "Människan i industrin"

    ,
    "Människans språk"

    ,
    "Människans säkerhet"

    ,
    "Mät-, styr- och reglerteknik"

    ,
    "Måleri"

    ,
    "Måltids- och branschkunskap"

    ,
    "Mönsterkonstruktion"

    ,
    "Natur- och landskapsvård"

    ,
    "Naturbruk"

    ,
    "Naturbrukets byggnader"

    ,
    "Naturbruksteknik"

    ,
    "Naturguidning"

    ,
    "Naturkunskap"

    ,
    "Naturvetenskaplig specialisering"

    ,
    "Naturvetenskaplig spets.."

    ,
    "Näthandel"

    ,
    "Nätverksteknik"

    ,
    "Odling"

    ,
    "Odling i växthus"

    ,
    "Pedagogik"

    ,
    "Pedagogik i vård och omsorg"

    ,
    "Pedagogiskt arbete"

    ,
    "Personbilsteknik"

    ,
    "Persontransporter"

    ,
    "Plåtslageri"

    ,
    "Plåtslageriteknik"

    ,
    "Processautomation"

    ,
    "Produktionsfilosofi"

    ,
    "Produktionskunskap"

    ,
    "Produktionsutrustning"

    ,
    "Produktutveckling"

    ,
    "Programmering"

    ,
    "Psykiatri"

    ,
    "Psykologi"

    ,
    "Reception"

    ,
    "Religionskunskap"

    ,
    "Rennäring"

    ,
    "Reseproduktion och marknadsföring"

    ,
    "Rid- och körkunskap"

    ,
    "Ridning och körning"

    ,
    "Samernas kultur och historia"

    ,
    "Samhällsbyggande"

    ,
    "Samhällskunskap"

    ,
    "Samisk mat och matkultur"

    ,
    "Samiskt hantverk"

    ,
    "Sammanfogningsteknik"

    ,
    "Serveringskunskap"

    ,
    "Service och bemötande"

    ,
    "Serviceteknik – naturbruk"

    ,
    "Sjukvård"

    ,
    "Sjöfartssäkerhet"

    ,
    "Skog, mark och vatten"

    ,
    "Skogsmaskiner"

    ,
    "Skogsproduktion"

    ,
    "Skötsel av utemiljöer"

    ,
    "Snöfordonsteknik"

    ,
    "Socialt arbete"

    ,
    "Sociologi"

    ,
    "Specialidrott"

    ,
    "Specialpedagogik"

    ,
    "Språk specialisering"

    ,
    "Spårfordonsteknik"

    ,
    "Stycknings- och charkuterikunskap"

    ,
    "Styckningskunskap"

    ,
    "Support och servicearbete"

    ,
    "Svenska"

    ,
    "Svenska för döva"

    ,
    "Svenska som andraspråk"

    ,
    "Svenskt teckenspråk"

    ,
    "Svenskt teckenspråk för hörande"

    ,
    "Systemkunskap"

    ,
    "Teater"

    ,
    "Teknik"

    ,
    "Teknik i vård och omsorg"

    ,
    "Teknisk isolering"

    ,
    "Tillverkningsunderlag"

    ,
    "Transportteknik"

    ,
    "Travkunskap"

    ,
    "Trä"

    ,
    "Trädgårdsanläggning"

    ,
    "Trädgårdsmaskiner"

    ,
    "Trädgårdsodling"

    ,
    "Träningslära"

    ,
    "Turism"

    ,
    "Tätskikt våtrum"

    ,
    "Utställningsdesign"

    ,
    "VVS – installation"

    ,
    "VVS-teknik"

    ,
    "Vatten- och miljöteknik"

    ,
    "Vattenbruk"

    ,
    "Vattenkraftteknik"

    ,
    "Ventilationsplåtslageri"

    ,
    "Ventilationsteknik"

    ,
    "Verktygs- och materialhantering"

    ,
    "Visuell kommunikation"

    ,
    "Växtkunskap"

    ,
    "Växtodling"

    ,
    "Våningsservice"

    ,
    "Vård och omsorg"

    ,
    "Vård och omsorg specialisering"

    ,
    "Webbteknik"

    ,
    "Yttre miljö"]