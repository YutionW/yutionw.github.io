---
layout:     post
title:      Series Articles of Researching Recording - 01
subtitle:   NN shallowing and py-files
date:       2020-01-02
author:     OUC_LiuX
header-img: img/wallpic02.jpg
catalog: true
tags:
    - deep compression 
    - pytorch
---

# Head files
We'd import the following modules and packages and remember these libraries unconditionally:
```javascript
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import torch.backend.cudnn as cudnn
from torch.utils.data import DataLoader 
import torchvision
from torchvision.transforms as transforms
from torchvision.dataset import ImageFolder
import os
from PIL import Image
import numpy as np
import utils, model 
```

# custom network layer
It should be careful to use the following style that use ___nn.Sequential()___ and  ___OrderDict___ to establish your networks
```javascript
nn.Sequential(
	OrderDict(
	[nn.Conv2d(...)
	...
	]))
```
since the way will named layers of networks after (0)(1)(2) by default.
The following form is suggested:
```javascript
class model(nn.Module):
	def __init__(self):
        super(model, self).__init__()
        self.conv1_1 = nn.Conv2d(  3,  64, 3, 1, 1)
        self.bn1_1 = nn.BatchNorm2d( 64)
        self.conv1_2 = nn.Conv2d( 64,  64, 3, 1, 1)
        ... ...
        self.classifier = nn.Linear(512, 10)
        self.processDic = {}
        
   def forward(self, x):
        out = F.relu(self.bn1_1(self.conv1_1(x)))
        self.processDic["conv1_1"] = out
        out = F.relu(self.bn1_2(self.conv1_2(out)))
        self.processDic["conv1_2"] = out
        out = F.max_pool2d(out, kernel_size=2, stride=2)
        ...
        out = out.view(out.size(0), -1)
        out = self.classifier(out)
        return out, self.processDic
  ```
 There aer some points should be cared in the above content:
  1.  **\__ _init___( self)** Calculating layers(convolutional and linear layers) and Batch Normalization layer are defined here, and only these two type of layers for these parameters is trainable and should be trained(update). As far as ___max_pool2d()___ and **_relu()_**, they have no parameters need to be trained, so  **torch.nn.functional()** is suggested.
  2. **\__ _init___( self)** A dictionary defined here  **processDict={}**. This dictionary is used to store the process result during the net running，assignment is occurred in function **forward(x)**  and the dictionary is returned while the method ending.
  3. **relu**, **max_pool2d** have no trainable parameters so method **torch.nn.functional** is suggested.
# Custom Image Dataset
Image folder dataset is suggested to use to train the network for the small scale dataset examples like cifar10/100, mnist, svhn that can be loaded by pytorch
 with existed and embedded API  are actually special and not practical in industrial production. 
## For Cifar10
In order to use images-type data set of cifar10, we'd transform the type of cifar_based_on_python to visual images. The process of transformation is general. 
```javascript
import pickle    # cPickle if python2
import os 
import numpy 
from PIL import Image

img_dir = "/home/liuxiang/pytorch/data/"
batch_name = "/home/liuxiang/pytorch/data/cifar-10-batches-py/"

os.chdir("/home/liuxiang/pytorch/data/")
if ( not os.path.isdir("cifar_images")):
	os.mkdir("./cifar_images")
os.chdir("./cifar_images")

if not os.path.isdir("train"):
	os.mkdir("train")
if not os.path.isdir("test"):
	os.mkdir("test")
for i in range(10):
	if not os.path.isdir("./train/"+str(i)):
		os.mkdir("./train"+str(i))
	if not os.path.isdir("./test/"+str(i)):
		os.mkdir("./test/"+str(i))

def unload(filename):
	with open(filename, 'rb') as f:
		data = pickle.load(f, "latin1")
		X = data["data"]
		Y = data["labels"]
		X = X.reshape((-1, 3, 32, 32))
		Y = np.array(Y)
		return X, Y

def store_image(batch_dir, image_dir, train=True):
	if train:
		for k in range(1, 6):
			imgX, imgY = unload(batch_dir+"data_batch_"+str(k))
			for i in range(len(imgY)):
				imgs = imgX[i]
				img0 = Image.fromarray(imgs[0])
				img1 = Image.fromarray(imgs[1])
				img2 = Image.fromarray(img2[2])
				img = Image("RGB", (img0, img1, img2))
				img.save(image_dir+str(imgY[i])+"/"+\
				str(i+(k-1)*len(imgY)))+".png", "png")
	else:
		imgX, imgY = unload(batch_dir+"test_batch")
		for i in range(len(imgY)):
				imgs = imgX[i]
				img0 = Image.fromarray(imgs[0])
				img1 = Image.fromarray(imgs[1])
				img2 = Image.fromarray(img2[2])
				img = Image("RGB", (img0, img1, img2))
				img.save(image_dir+str(imgY[i])+"/"+\
				str(i)+".png", "png")
```
So now we have stored the images of cifar10 into images direction. In addition, If you are obsessional so that you want to rename the picture names into universal form, we've also provided the rename function following:
```javascript
def rename(dir_name):
	i = 0
	for parents, dirnames, filenames in os.walk(dir_name):
		for filename in filenames:
			if i < 10:
				newName = "0000"+str(i)+".png"
				os.rename(os.path.join(parents, filename), os.path.join(parents, newName))
				i += 1
			elif i < 100:
				newName = "000"+str(i)+".png"
				os.rename(os.path.join(parents, filename), os.path.join(parents, newName))
				i += 1
			elif i < 1000:
				newName = "00"+str(i)+".png"
				os.rename(os.path.join(parents, filename), os.join(parents, newName))
				i += 1
			elif i < 10000:
				newName = "0"+str(i)+".png"
				os.rename(os.path.join(parents, filename), os.join(parents, newName))
				i += 1
			else:
				newName = str(name)+".png"
				os.rename(os.path.join(parents, filename), os.path.join(parents, newName))
```
To complete establishment of images dataset, just run the __main()__:
```javascript
img_dir = "/home/liuxiang/pytorch/data/cifar_images/"
batch_name = "/home/liuxiang/pytorch/data/cifar-10-batches-py/"
def main():
	store_image(batch_name, image_dir+"train/", True)
	store_image(batch_name, image_dir+"test/", False)
	for i in range(10):
		rename(img_dir+"train/"+str(i))
		rename(img_dir+"train/"+str(i))
```
## Load the data set with pytorch
There are some pytorch packages and modules are required to load dataset for pytorch
```javascript
import torch
import torchvision
from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder
import os
import torchvision.transforms as transforms

Image_dir = "/home/liuxiang/pytorch/data/cifar_images/"
transform_train = transforms.Compose([
	transforms.RandomCrop(32, padding=4)
	transforms.RandomHorizontalFlip(),
	transforms.RandomVerticalFlip(),
	transforms.ToTensor(),
	transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010))
	])
transform_test = transform.Compose([
	transforms.ToTensor(),
	transforms.Normalize((0.4914, 0.4822, 0.4465), (0.2023, 0.1994, 0.2010))
])
```
Here notifying that we have given the mean and standard value of dataset, if we do not know the what the mean/std values are, the following method is usable
```javascript
	test_data_ = ImageFolder(image_test, transforms.Compose([
	transform.ToTensor(),
	transform.Normalize((0,0,0), (1,1,1))
	]))
	mean, std = get_mean_and_std(test_data_)
```
where the function *__get_mean_and_std()__* defined on my [github](https://github.com/OUCliuxiang/pytorch/blob/master/utils.py)
 Now that we have got the pytorch-typed dateset via```train_data = ImageFolder(image_train, transform_train)```, we'd also make that accepted by net: 
```
train_loader = DataLoader(train_data, batched=200, shuffle=True, num_workers=2)
```
The test data set is similarly.
# Train
We've establish a model and its forward process before. now let we see how to train and test it!
## Enable a model
 Assume we define the model as *__class model(nn.Moduule)__* on file *__model\.py__*, so that we 
 ```from model import model```
 and 
 ```net = model()```
 Pytorch allows we select which type of device the net running manually. We can select device according is GPU available:
 ```
 device = "cuda" if torch.cuda.is_available() 
 net.to(device)
 ```
 If GPU is available, the usage of **cudnn.benchmark** will accelerate your train process by finding the best algorithm by **auto-tuner** mechanism automatically.
 In order to use **cudnn.benchmark**, we'd 
 ```import torch.backends.cudnn as cudnn```
 and use command
 ```cudnn.benchmark = True```
 to use it.
 In addition, if you have more than one GPUs, parallel calculating is allowed on pytorch. There is just one line to use parallel calculation:
 ```
 if device == "cuda":
 	net = torch.nn.DataParallew(net)
 ```
We'd noticed that once if parallel calculation is used, all GPUs will be called to support the program's running, even though you give your program restricted command like
```CUDA_VISIBLE_DEVICES=x python train.py ...```
However, the type of tensor will be changed after we use parallel calculation, for example it will be changed to 
```module.feature.conv1_1.weight```
from 
```conv1_1.weight```
We are going to discuss the change later on session "save and reload model".
## State criterion and optimizer
During the train process, there only *__CrossEntropy()__*  is used. when we start our KD process, the custom loss layer will be used.
define the criterion outside the train process, and define optimizer inside the train process to control learning rate:
```
criterion = nn.CrossEntropyLoss()
def train(...):
	optimizer = optim.SGD(net.parameters(), lr, momentum, weight_decay)
	...
```
Notifying here that we send the output of last fc layer to *__CrossEntropyLoss()__* directly with out *__softmax()__* for *__CrossEntropyLoss()__*  already contains the softmax process(nagetive log)
## Enter training and test function
### STATUS STATED
It's important to state which statue the networks running on, use:
```net.train()```during training process and 
```net.eval()```during test process
due to _train()_ will update parameter and _eval()_ will not do this. It's obviously that if we running test under _train()_[default] state, the result is very very very bad.

### Train
Before we start training iterations, some variables are excepted to be established that ```train_loss=.0```to record the training loss, ```correct=0```to record how many inferences are correct each batch during training, and ```total=0 ```to record how many judges we have done totally, so that the total accuracy is calculated as _100. * correct / total %_. Then we enter batches iteration:
```javascript
for batch_idx, (inputs, targets) in enumerate(train_loader):
	inputs, targets = inputs.to(deivce), targets.to(device) #1
	optimizer.zero_grad() #2
	outputs = net(inputs) #3
	loss = criterion(outputs, targets) #4
	loss.backward()  #5
	optimizer.step()  #6 

	train_loss += loss.item() 
	_, predicted = outputs.max(1) 
	total += targets.size(0) 
	correct += predicted.eq(targets).sum().item()
	
	utils.process_bar(batch_idx, len(train_loader), 
					  "Loss: %.3f | Acc: %.3f%% (%d/%d)"
					  %(train_loss / (batch_idx+1), 100. * correct / total, corrected, total ))
```
Explain:
1. data and net are excepted to running on the same device
2. each iteration/batch is expect calculating grad from zero
3. get outputs of the net given inputs data
4. calculating loss with _criterion(outputs, class)_
5. calculating grad via backward process of loss.
6. update trainable parameters sent into optimizer
### Test
```net.eval()```is expected to use to prevent the parameters update has been stated; variables are same with training process:```train_loss, correct, total```. A global variable best_acc should be stated ```global best_acc```for it may be inherited from file```ckpt.t7```and is expected to have the only value all around the program. Let we enter the test process:
```javascript
with torch.no_grad() #1
	for idx, (inputs, targets) in enumerate(test_loader):
		inputs, targets = inputs.to(device), targets.to(device)
		outputs = net(inputs)
		loss = criterion(outputs, targets)

		total_test += loss.items()
		_, predicted = output.max(1)
		total += targets.size(0)
		correct += predicted.eq(targets).sum().item()
		utils.progress_bar(...)
```
After all batches are finished, the best model state should be stored
```javascript
acc = 100.*correct/total
if acc > best_acc:
	best_acc = acc
	state = {
		"net": net.state_dict(),
		"acc": acc,
		"epoch": epoch
	}
	if not os.path.isdir("checkpoint"):
		os.mkdir("./checkpoint")
	torch.save(state, "cktp.t7")
```
## Start
Then just run like
```
for epoch in range(start_epoch, start_epoch+200):
	train(epoch)
	test(epoch)
```

# Load and extract parameters and process outputs
Assuming that we have stored old state_dict(with three fully connection layers) as ```./checkpoint/cktp.t7```and then we'll extract it and reload it into another model(only one fully connection layer)
## parameters' s extract and reload
```javascript
model_new = model()
model.to(device)
old_state = torch.load("./checkpoint/cktp.t7")["net"]
new_state = model.state_dict()
```
Notifying here, do not send model_new into parallel calculation, if do it, the new_state.key() will become to type like ```"module.conv1_1.weight"```, and if not, or says just the current state, it's keys is just```"conv1_1.weight"```
If there are two same model, you can use command
```javascript
new_state.update(old_state)
model_new.load_state_dict(new_state)
```
to load the old state, however we know that the two model's state dict is not same that one has three fully connection layers and another has only one, so that the fully connection layers is not suit to be load, do this:
```javascript
new_name = new_state.keys()
old_name = old_state.keys()
for i in range(len(new_name)-2):
	new_state[new_name[i]] = old_state[old_name[i]]
model_new.load_state_dict(new_state)
```
In this way we should ensure that the order of two net's layers you made are same.
After these steps, the keys' s type is still ```"conv1_1.weight"```, when you send the network into parallel calculation, it becomes ```"module.conv1_1.weight"```
Actually, we do not suggest you use parallel calculation but just send the current model into training and test process while you are sharing GPUs with partners.

## Process outputs
It's so easy to do for we have established  a dictionary in  _init()_ to store the process value so just do  as following to pick the first 200 pictures' process outputs up:
```javascript
with torch.no_grad():
	net.eval()
	for index, (inputs, targets) in enumrate(test_loader):
		for index>0:
			break;
		inputs, targets = inputs.to(device), targets.to(device)
		outputs, processDict = net(inputs)
```
Now we got it. Then we'll save and load it:
```javascript
np.savez_compressed("./processDict.npz", dict=processDict)
data = np.load("./processDict.npz")
processDict_ = data["dict"][()]
```
It's finished

# Retrain and Squeeze
When we start to retrain network in distilling method with some layers are squeezed that do not participate the gradient backward and parameters update, we support two method to decide which layers are squeezed.
First to check the layers' name and index and do them require gradient:
```javascript
for index, (k, v) in enumerate(net.named_parameters()):
	print( index, k, v.requires_grad)
```
- method 1
```javascript
for  index, (k, v) in enumerate(net.named_parameters()):
	if ("classifier" in k or "5_3" in k):
		v.requires_grad = False
```
- method 2
```javascript
for  index, (k, v) in enumerate(net.named_parameters()):
	if (index > xx):
		v.requires_grad = False
```
Then if you check the _net.parameters().requires_grad_with sentence 
```
for  param in model_new.parameters():
    print (param.requires_grad)
```
you may found that some of them is False now. However, we can still not send the parameters into optimizer now even though there are already some layers' property _requires_grad_ is False now, we'd just send layers we want to train into optimizer, so that we need to filtrate the layers requires_grad in False out with
***
```javascript
trainable_params = filter(lambda param: param.requires_grad, net.parameters())
```
***

After these steps, retrain the net with optimizer 
**```optimizer = optim.SGD(trainable_params, lr, moment, weight_decay)```**
