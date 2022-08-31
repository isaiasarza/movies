import { Injectable } from "@angular/core";
import { addDoc, collection, collectionData, CollectionReference, Firestore, query } from "@angular/fire/firestore";
import { map, Observable } from "rxjs";
import { IReview } from "../interfaces/review.interface";
import {AngularFirestore} from '@angular/fire/compat/firestore'
@Injectable({ providedIn: 'root' })
export class ReviewsService{

    private readonly COLLECTION_NAME = "reviews"
    private collection: CollectionReference

    constructor(private firestore: Firestore, private afsCompact: AngularFirestore){
        this.collection = collection(this.firestore, this.COLLECTION_NAME)
    }

    /**
     * Retorna todas las opiniones
     * realizadas a una película en
     * particular.
     * 
     * @param movieId 
     * @returns 
     */
    getByMovieId(movieId: string): Observable<IReview[]>{
        return this.afsCompact
        .collection(this.COLLECTION_NAME, (ref) =>
          ref.where('movieId', '==', movieId)
        )
        .valueChanges({ idField: 'id' })
        .pipe(map((reviews: unknown[]) => reviews as IReview[]))
    }

    add(review: IReview){
      return addDoc(this.collection, review);
    }

}