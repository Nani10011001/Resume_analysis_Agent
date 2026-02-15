flow of the agent 
1. agent thing will load the pdf for loading the pdf thing we will check that pdf is exist or not using the os.path exist thing and raise the error if exist it will go to the furthur steps like the pyPDFLoader thing using langchain community things it help us to load the data thing into the using the function call pyPDFLoader(file) and the using method pyPDFLoader.load() after that we want to take the all that with int the variable called text using d.page_content for d in docs things
line by line "/n" after that we want make the connect for it so we use the RecursiveCharacterTextSplitter things and it as the chunk_size thing(800 words )and the overlap thing for connection thingschunks(200) things then after that we split_text(text) and use the embedding thing of huggingFace("sentence tranformer) things for it and then 
using the embedding.embed_document to convert the chunks of data into the vector form float data types thing then we want store the data things

MongoDb thing using the connection of it 
Client=MongClient(env) then create 
db=client["agentDatething]
and create the collection things
db["embedding"] thing
after that we should want create the schema for validation things
like the embedding store thing
using the pydantic we take configDict thing for allow that bson ObjectId() thing and and json_endor thing so as for the schema thing{
    userid:ObjectId(),
    text:List[str],
    embedding:List[List[float]],
     source:str,
     version:int

}
and things for it
thing add for storing the info we create the funtion with userid and text query thing takes the each info thing validate through the schema of it and store the info thing
for retrive the info we create the function for it using user inof thing and we want embedd the query thing usinf embed_query thing and it search the top_k=5 thing and gives the info things 

                ┌────────────────────┐
                │      PDF File      │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │   PyPDFLoader      │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │   Text Extraction  │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ Recursive Splitter │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │ HuggingFace Embed  │
                └─────────┬──────────┘
                          ↓
                ┌────────────────────┐
                │    MongoDB Store   │
                └─────────┬──────────┘
                          ↓
          User Query → Embed → Similarity → Top 5
