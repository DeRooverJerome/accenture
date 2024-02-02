export default function cn(...classes) {
    return classes.filter(Boolean).join(' ')
}

//This is used to add conditionnal classes and used for styling.