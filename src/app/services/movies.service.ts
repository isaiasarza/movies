import { Injectable } from "@angular/core";
import { collection, collectionData, CollectionReference, doc, docData, Firestore, setDoc } from "@angular/fire/firestore";
import { first, Observable } from "rxjs";
import { IMovie } from "../interfaces/movie.interface";

@Injectable({ providedIn: 'root' })
export class MoviesService {
    private readonly COLLECTION_NAME = "movies"
    private collection: CollectionReference

    constructor(private firestore: Firestore) {
        this.collection = collection(this.firestore, this.COLLECTION_NAME)
    }

    getAll(): Observable<IMovie[]> {
        return collectionData(this.collection, {
            idField: 'id',
        }) as Observable<IMovie[]>
    }
}