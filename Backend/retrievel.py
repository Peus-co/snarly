from Embedding import get_Embedding, collection


def Search_Chunks(prompt , n_results=3):
    prompt_embedding = get_Embedding(prompt)
    results=  collection.query(
        query_embeddings=[prompt_embedding],
        n_results=n_results
    )
    return results