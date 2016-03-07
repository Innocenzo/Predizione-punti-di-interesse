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
