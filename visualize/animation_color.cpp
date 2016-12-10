#include <stdlib.h>
#include <GL/glut.h>
#include <opencv2/opencv.hpp>

//variable for viewpoint
double camera_roll = -30.0;
double camera_pitch = -30.0;
double camera_distance = 200.0;

//variable for mouse
bool drag_mouse_l = false;
bool drag_mouse_r = false;

int last_mouse_x;
int last_mouse_y;
	
GLdouble vertex[][3]{
	{ 0.0, 0.0, 0.0 },
	{ 40.0, 0.0, 0.0 },
	{ 40.0, 40.0, 0.0 },
	{ 0.0, 40.0, 0.0 },
	{ 0.0, 0.0, 40.0 },
	{ 40.0, 0.0, 40.0 },
	{ 40.0, 40.0, 40.0 },
	{ 0.0, 40.0, 40.0 }
};

int face[][4]{
	{0, 1, 2, 3},
	{1, 5, 6, 2},
	{5, 4, 7, 6},
	{4, 0, 3, 7},
	{4, 5, 1, 0},
	{3, 2, 6, 7}
};

GLdouble color[][3] = {
  { 1.0, 0.0, 0.0 },
  { 0.0, 1.0, 0.0 },
  { 0.0, 0.0, 1.0 },
  { 1.0, 1.0, 0.0 },
  { 1.0, 0.0, 1.0 },
  { 0.0, 1.0, 1.0 }
};

int edge[][2]{
	{ 0, 1 },
	{ 1, 2 },
	{ 2, 3 },
	{ 3, 0 },
	{ 4, 5 },
	{ 5, 6 },
	{ 6, 7 },
	{ 7, 4 },
	{ 0, 4 },
	{ 1, 5 },
	{ 2, 6 },
	{ 3, 7 }
};

GLuint loadImage(const char* path){
	cv::Mat img = cv::imread("./image/icon.png");
	cv::flip(img, img, 0);
	cv::cvtColor(img, img, CV_BGR2RGB);

	GLuint tex;
	glGenTextures(1, &tex);

	glBindTexture(GL_TEXTURE_2D, tex);

	gluBuild2DMipmaps(GL_TEXTURE_2D, 3, img.cols, img.rows, GL_RGB, GL_UNSIGNED_BYTE, img.data);

	return tex;
}

void idle(void){
	glutPostRedisplay();
}

void display(void){
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	glTranslatef(0.0, 0.0, -camera_distance);
	glRotatef(-camera_pitch, 1.0, 0.0, 0.0);
	glRotatef(-camera_roll, 0.0, 0.0, 1.0);

	// 地面を描画
	double ground_max_x = 200.0;
	double ground_max_y = 200.0;
	double STEP = 10.0;

	glBegin(GL_LINES);
	for(double ly = -ground_max_y; ly <= ground_max_y; ly += STEP){
		if((int)ly % 200 == 0){
			glColor3d(1.0, 1.0, 1.0);
		}else if((int)ly % 40 == 0){
			glColor3d(0.8, 0.8, 0.8);
		}else{
			glColor3d(0.5, 0.5, 0.5);
		}

		if(ly == 0.0){
			glColor3d(0.0, 1.0, 0.0);
		}
		
		glVertex3d(-ground_max_x, ly, 0);
		glVertex3d(ground_max_x, ly, 0);
	}
	for(double lx = -ground_max_y; lx <= ground_max_y; lx += STEP){
	    if((int)lx % 200 == 0){
			glColor3d(1.0, 1.0, 1.0);
		}else if((int)lx % 40 == 0){
			glColor3d(0.8, 0.8, 0.8);
		}else{
			glColor3d(0.5, 0.5, 0.5);
		}

		if(lx == 0.0){
			glColor3d(1.0, 0.0, 0.0);
		}
		
		glVertex3d(lx, -ground_max_y, 0);
		glVertex3d(lx, ground_max_y, 0);
	}

	glColor3d(0.0, 0.0, 1.0);
	glVertex3d(0, 0, -200);
	glVertex3d(0, 0, 200);
	
	glEnd();

	glColor3d(0.0, 0.0, 0.0);
	glBegin(GL_QUADS);
	for(int j = 0;j < 6;j++){
		glColor3dv(color[j]);
		for(int i = 0;i < 4;i++){
			glVertex3dv(vertex[face[j][i]]);
		}
	}
	glEnd();

	glutSwapBuffers();
}

void resize(int  w, int h){
	glViewport(0, 0, w, h);

	//透視変換行列の設定
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(45.0, (double)w / (double)h, 1.0, 500.0);
}

void mouse(int button, int state, int x, int y){
	if ( ( button == GLUT_LEFT_BUTTON ) && ( state == GLUT_DOWN ) )
		drag_mouse_l = true;
	else drag_mouse_l = false;

	if ( ( button == GLUT_RIGHT_BUTTON ) && ( state == GLUT_DOWN ) )
		drag_mouse_r = true;
	else drag_mouse_r = false;

	// 現在のマウス座標を記録
	last_mouse_x = x;
	last_mouse_y = y;
}

void  motion( int mx, int my )
{
	if (drag_mouse_l){
		camera_distance += ( my - last_mouse_y ) * 1.0;
		if (camera_distance < 5.0)
			camera_distance = 5.0;
	}
	
	if ( drag_mouse_r ){
		camera_roll -= ( mx - last_mouse_x ) * 1.0;
		if ( camera_roll < 0.0 )
			camera_roll += 360.0;
		else if ( camera_roll > 360.0 )
			camera_roll -= 360.0;

		float  delta_roll = ( mx - last_mouse_x ) * 1.0;

		camera_pitch -= ( my - last_mouse_y ) * 1.0;
	}

	// 今回のマウス座標を記録
	last_mouse_x = mx;
	last_mouse_y = my;

	// 再描画の指示を出す（この後で再描画のコールバック関数が呼ばれる）
	glutIdleFunc(idle);
}

void keyboard(unsigned char key, int x, int y){
	switch(key){
	case 'q':
	case 'Q':
	case '\033': //escキー
		exit(0);
	default:
		break;
	}
}

void init(void){
	glClearColor(0.0, 0.0, 0.0, 0.0);
	glEnable(GL_DEPTH_TEST);
	//glEnable(GL_CULL_FACE);
	//glCullFace(GL_FRONT);
}

int main(int argc, char *argv[]){
	//glut init
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGBA | GLUT_DOUBLE | GLUT_DEPTH);
	glutInitWindowSize(1280, 960);
	glutCreateWindow("BDM");

	//set function
	glutDisplayFunc(display);
	glutReshapeFunc(resize);
	glutMouseFunc(mouse);
	glutMotionFunc(motion);
	glutKeyboardFunc(keyboard);

	//initialize
	init();

	//main loop
	glutMainLoop();

	return 0;
}
