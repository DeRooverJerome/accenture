import { Button, message, Popconfirm } from "antd";

export default function ConfirmDeleteBtn() {
    const confirm = (e) => {
        console.log(e);
        message.success("Address deleted !");
    };
    const cancel = (e) => {
        console.log(e);
        message.error("Address not deleted !");
    };

    return (
        <Popconfirm
            title="Delete"
            description="Are you sure to delete this address?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
        >
            <Button danger>Delete</Button>
        </Popconfirm>
    );
}
