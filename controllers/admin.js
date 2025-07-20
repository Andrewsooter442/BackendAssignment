import AdminModels from "../models/editMenuModels.js"; 

// Add category.
async function handelGetAddCategoryPage(req, res) {
    res.render("menuEdit.ejs", {
        title: "Add New Category",
        type: "category",
        action: "/admin/addCategory",
        data: {},
    });
}

async function handelPostAddCategory(req, res) {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).send("Category name is required.");
        }
        await AdminModels.createCategory(name.trim());
        res.redirect('/');
    } catch (error) {
        console.error("Controller Error: Failed to create category.", error);
        res.status(500).send("Error creating category.");
    }
}

// Edit Category 
async function handelGetEditCategoryPage(req, res) {
    try {
        const { id } = req.params;
        const category = await AdminModels.getCategoryById(id);

        if (!category) {
            return res.status(404).send("Category not found.");
        }

        res.render("menuEdit.ejs", {
            title: "Edit Category",
            type: "category",
            action: `/admin/editCategory/${id}`,
            data: category,
        });
    } catch (error) {
        console.error("Controller Error: Failed to fetch category.", error);
        res.status(500).send("Error loading category edit page.");
    }
}

async function handelPostEditCategory(req, res) {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).send("Category name is required.");
        }
        await AdminModels.updateCategory(id, name.trim());
        res.redirect('/');
    } catch (error) {
        console.error("Controller Error: Failed to update category.", error);
        res.status(500).send("Error updating category.");
    }
}

// Add Item 

async function handelGetAddItemPage(req, res) {
    try {
        const categories = await AdminModels.getAllCategories();
        res.render("menuEdit.ejs", {
            title: "Add New Item",
            type: "item",
            action: "/admin/addItem",
            data: {},
            categories: categories
        });
    } catch (error) {
        console.error("Controller Error: Failed to load 'Add Item' page.", error);
        res.status(500).send("Error loading page.");
    }
}

async function handelPostAddItem(req, res) {
    try {
        await AdminModels.createItem(req.body);
        res.redirect('/');
    } catch (error) {
        console.error("Controller Error: Failed to add new item.", error);
        res.status(500).send("Error adding new item.");
    }
}

// Edit Item Page
async function handelGetEditItemPage(req, res) {
    try {
        const { id } = req.params;
        const [item, categories] = await Promise.all([
            AdminModels.getItemById(id),
            AdminModels.getAllCategories()
        ]);

        if (!item) {
            return res.status(404).send("Item not found.");
        }

        res.render("menuEdit.ejs", {
            title: "Edit Item",
            type: "item",
            action: `/admin/editItem/${id}`,
            data: item,
            categories: categories
        });
    } catch (error) {
        console.error("Controller Error: Failed to load 'Edit Item' page.", error);
        res.status(500).send("Error loading item edit page.");
    }
}

async function handelPostEditItem(req, res) {
    try {
        const { id } = req.params;
        await AdminModels.updateItem(id, req.body);
        res.redirect('/');
    } catch (error) {
        console.error("Controller Error: Failed to update item.", error);
        res.status(500).send("Error updating item.");
    }
}

export {
    handelGetAddCategoryPage,
    handelPostAddCategory,
    handelGetEditCategoryPage,
    handelPostEditCategory,
    handelGetAddItemPage,
    handelPostAddItem,
    handelGetEditItemPage,
    handelPostEditItem
};