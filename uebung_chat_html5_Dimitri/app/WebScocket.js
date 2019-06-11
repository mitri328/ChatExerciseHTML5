
export const Ws_event = {
    message_added: 'message_added',
    user_added: 'user_added',
    user_updated: 'user_updated',
    user_deleted: 'user_deleted'
}

/*

Messages formats examples

var o = {
    "action": "message_added",
    "message": "",
    "timestamp": "2019-06-10T10:20:16.4207387Z",
    "data": {
        "id": "7c69905d-7ba9-482d-b0bc-70ac677d70b4",
        "timestamp": "2019-06-10T10:20:16.3825617Z",
        "user_id": "7c02a512-eb18-4db1-8628-4bc2cb7f36ed",
        "message": "test blbla"
    }
}

o = {
    "action": "user_updated",
    "message": "",
    "timestamp": "2019-06-10T09:25:31.8856856Z",
    "data": {
        "id": "e630d576-a204-4ee9-9efb-9524baac336b",
        "created": "2019-06-10T08:43:22.2117706",
        "updated": "2019-06-10T09:25:31.8495431Z",
        "last_status_change": "2019-06-10T09:25:31.849543Z",
        "status": "online",
        "nickname": "007",
        "avatar": "1",
        "description": ""
    }
}

o = {
    "action": "user_added",
    "message": "",
    "timestamp": "2019-06-10T09:37:57.7666949Z",
    "data": {
        "id": "c946448d-46cf-41e8-b319-3f56517b02fe",
        "created": "2019-06-10T09:37:57.7405644Z",
        "updated": "2019-06-10T09:37:57.7405644Z",
        "last_status_change": "2019-06-10T09:37:57.7405644Z",
        "status": "offline",
        "nickname": "12",
        "avatar": "1",
        "description": ""
    }
}

o = {"action": "echo", "message": "Hello World", "timestamp": "2019-06-10T09:21:54.0780981Z"}

o = {
    "action": "user_deleted",
    "message": "",
    "timestamp": "2019-06-10T10:37:38.58058Z",
    "data": {
        "id": "fd1a699d-592d-469e-83e3-777563d0a6a3",
        "created": "0001-01-01T00:00:00",
        "updated": "0001-01-01T00:00:00",
        "last_status_change": "0001-01-01T00:00:00",
        "status": "offline"
    }
}
*/