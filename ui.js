




function mouseDragged() {
    if (tooltip == "block") {
        const cellRow = Math.floor(mouseY / size);
        const cellCol = Math.floor(mouseX / size)

        grid[cellRow][cellCol].state = "block";
    }
}

function selectTooltip(tip) {
    tooltip = tip;
    switch (tip) {
        case "block":
            blck_btn.setAttribute("class", "active")
            st_btn.setAttribute("class", "")
            end_btn.setAttribute("class", "")
            break;
        case "start":
            st_btn.setAttribute("class", "active")
            blck_btn.setAttribute("class", "")
            end_btn.setAttribute("class", "")
            break;
        case "end":
            end_btn.setAttribute("class", "active")
            st_btn.setAttribute("class", "")
            blck_btn.setAttribute("class", "")
            break;

    }
}
