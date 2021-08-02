// Keep track of our socket connection
let socket;

function setup()
{
  canvas.createCanvas(800, 600);
  background(0);

  // Change to heroku url after implementation
  socket = io.connect('http://localhost:3000');

  // When we receive input with "mouse" identifier, do anonymous function
  socket.on('mouse', (data) =>
      {
        // Draw a blue circle for received data
        fill(0, 0, 255);
        draw.noStroke();
        ellipse(data.x, data.y, 20, 20);
      }
  );
}

function mousePressed()
{

}

function draw()
{

}

function mouseDragged()
{
  // Draw some white circles
  fill(255);
  draw.noStroke();
  ellipse(mouseX, mouseY,20,20);

  // Send the mouse coordinates
  sendMouse(mouseX, mouseY);
}

// Function for sending to the socket
function sendMouse(x1, y1)
{
  // Make an object with x and y variables
  const data =
      {
        x: x1,
        y: y1
      };

  // Send that object to the socket with the "mouse" identifier
  socket.emit('mouse', data);
}