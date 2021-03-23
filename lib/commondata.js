export const categories = [
    "Internet",
    "Other",
    "Open Source",
    "Mobile",
    "Java",
    "Software Engineering",
    "Web Development",
    "Microsoft .NET",
    "Microsoft",
    "Next Generation Databases",
    "Computer Graphics",
    "Object-Oriented Programming",
    "Networking",
    "Programming",
    "Cyber Security",
    "Python",
    "Mobile Technology",
    "Business",
    "XML",
    "Perl",
    "Client-Server",
    "PHP",
    "JavaScript",
    "swift",
    "Algorithms",
    "Data Structures",
    "SOA",
    "Computer Graph"
];

export const bookStatus = ["New", "Like New", "Old", "Used"];

export const makeCategoryOptions = () => {
    const data = [];
    categories.forEach(cat => {
        const object = createOption(cat);
        data.push(object);
    });
    return data;
}

export const makeBookStatusOptions = () => {
    const data = [];
    bookStatus.forEach(cat => {
        const object = createOption(cat);
        data.push(object);
    });
    return data;
}

export const createOption = (label) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
});