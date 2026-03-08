// Enums
export var ContentType;
(function (ContentType) {
    ContentType["VIDEO"] = "VIDEO";
    ContentType["AUDIO"] = "AUDIO";
    ContentType["DOCUMENT"] = "DOCUMENT";
    ContentType["TEXT"] = "TEXT";
})(ContentType || (ContentType = {}));
export var ProcessingStatus;
(function (ProcessingStatus) {
    ProcessingStatus["PENDING"] = "PENDING";
    ProcessingStatus["PROCESSING"] = "PROCESSING";
    ProcessingStatus["COMPLETED"] = "COMPLETED";
    ProcessingStatus["FAILED"] = "FAILED";
})(ProcessingStatus || (ProcessingStatus = {}));
export var EntityType;
(function (EntityType) {
    EntityType["PERSON"] = "PERSON";
    EntityType["PLACE"] = "PLACE";
    EntityType["CONCEPT"] = "CONCEPT";
    EntityType["ORGANIZATION"] = "ORGANIZATION";
    EntityType["TOPIC"] = "TOPIC";
})(EntityType || (EntityType = {}));
export var JobType;
(function (JobType) {
    JobType["TRANSCRIBE"] = "TRANSCRIBE";
    JobType["EXTRACT_TEXT"] = "EXTRACT_TEXT";
    JobType["GENERATE_EMBEDDINGS"] = "GENERATE_EMBEDDINGS";
    JobType["EXTRACT_ENTITIES"] = "EXTRACT_ENTITIES";
    JobType["GENERATE_TAGS"] = "GENERATE_TAGS";
})(JobType || (JobType = {}));
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["EDITOR"] = "EDITOR";
    UserRole["VIEWER"] = "VIEWER";
    UserRole["API_CLIENT"] = "API_CLIENT";
})(UserRole || (UserRole = {}));
