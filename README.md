# Profilazione dell'utente e predizione dei punti di interesse estratti dalle reti sociali
==========================================================================================

## Introduzione
---------------
Costruire un dataSet recuperando i dati di utenti e punti di interessi dalle reti sociali Instagram e Foursquare, successivamente vengono utilizzati degli algoritmi per elaborare i dati. Il nostro dataSet principalmente ci offre un insieme di dati che riguardano punti di interessi vari (es bar,ristorante,ecc) e per ognuno di essi corrisponde un set di foto che diversi utenti hanno pubblicato su Instagram in quel punto di interesse. Vengono utilizzati questi dati per costruire una timeline per ogni utente, ottenendo la storia dei punti di interesse che un utente ha visitato. Utilizzando la timeline di ogni utente applichiamo un algoritmo di clustering che permette di suddividere un insieme di utenti in k gruppi sulla base dei punti di interesse.
Nel dataSet applichiamo una  funzione di peso tf-idf (term frequency–inverse document frequency), sugli hashtag delle foto.

##Collections DataSet
-----------------------
* **venues**:  contiene i punti di interesse recuperati da foursquare per ottenere tutti i corrispondenti id instagram per identificare i luoghi.

* **instagram_venues**: contiene tutti i precedenti luoghi recuperati con le rispettive proprietà (nome, latitudine, longitudine, id_foursquare).

* **mediarecentvenues**: ogni istanza contiene la foto di un utente che ha fatto il check-in in un certo luogo, con le relative proprietà (come per esempio utenti con le proprie informazioni, commenti,  likes e i tag della relativa foto ecc…)

* **mediarecentidmaxes**: contiene l'id max del punto di interesse per esplorare la timeline e recuperare foto meno recenti.(id max caratteristica implementata in Instagram per la paginazione dei dati).

* **users**: ogni istanza contiene l'id dell'utente con la rispettiva lista di tutti i luoghi visitati;

* **tfidffinals**: insieme di istanze nelle quali ognuna contiene l'id di una location, con tutti i rispettivi tags di tutte le foto riferite a quella location; ogni tag inoltre è associato a un certo valore di tf-idf, calcolato usando due dataset di supporto come subroutines per il calcolo dei valori di interesse (mediarecenttags e tfidftags).

##Creazione dataSet
-------------------
Utilizziamo le API di Foursquare e di Instagram per recuperare i dati. Con le API di Foursquare riusciamo a ottenere dei punti di interessi di vari generi come monumenti, pizzerie , bar ecc., una volta recuperati i dati utilizziamo le API di Instagram per ottenere l'id Instagram da quello di foursquare abbiamo fatto questa scelta di combinare i due social perchè in questo modo noi filtriamo tutti i punti di interressi che per noi sono spam  dato che su instagram ogni utente oltre a fare il check-in in punti di interessi publici puo registrarsi in un luogo che crea al momento ad esempio casa mia e altro. Dopo aver ottenuto l'id di Instagram con lo script retrivalIdInstagram ci creiamo un'altra collezione instagram_venues. Ottenuti gli id su Instagram di ogni punto di interesse possiamo costruire la timeline di ogni luogo che rappresenta una collezione di foto che i vari utenti publicano facendo il check-in in quel punto di interesse. Tutti questi dati li salviamo in una collezione mediarecentvenues. Con lo script updateMediaRecent andiamo a salvare la cronologia delle foto di ogni punto di interesse che sono state publicate.
Nell'utilizzo delle API di Foursquare e Instagram abbiamo notato che ci stanno molte restrinzioni in foursquare la risposta della query che facciamo tramite le API se settiamo le coordinate geografiche e settiamo un raggio non ritorna tutti i luoghi che si trovano in quell'area ma solo una parte, per poter recuperare più dati abbiamo fatto più query con diverse coordinate ricoprendo l'intera area di Roma. Abbiamo modificato anche la libreria foursquarevenues che mancava la gestione degli errori. Nei vari script troviamo lo schema delle collezioni che utilizziamo per salvare i dati in mongodb.

##Elaborazione dati
-------------------
Costruito il dataset iniziamo ad elaborare i dati costruiamo una nuova collezione con createCollectionUserTimeline e con userTimeline ci costruiamo la cronologia delle foto che ogni utente a publicato nei vari punti di interesse in questo modo otteniamo la timeline di ogni utente che rappresenta la lista dei punti di interessi che ogni utente ha visitato.
